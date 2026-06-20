const fs = require('fs');
const cheerio = require('cheerio');
const url = require('url');

function extractYahooResults() {
  const html = fs.readFileSync('yahoo_res.html', 'utf8');
  const $ = cheerio.load(html);
  
  const results = [];
  
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const title = $(el).text().trim();
    
    if (href && href.includes('r.search.yahoo.com')) {
      try {
        const parsedUrl = new URL(href);
        const searchParams = parsedUrl.searchParams;
        // The RU parameter contains the destination website URL
        for (const [key, value] of parsedUrl.pathname.split('/').map(p => p.split('='))) {
          // Sometimes it is formatted inside path segments like RU=...
        }
        
        // Let's extract the RU parameter from pathname or search
        let targetUrl = '';
        const ruMatch = href.match(/\/RU=([^/]+)/);
        if (ruMatch) {
          targetUrl = decodeURIComponent(ruMatch[1]);
        }
        
        if (targetUrl && targetUrl.startsWith('http') && 
            !targetUrl.includes('yahoo.com') && 
            !targetUrl.includes('yahoo.co') && 
            !targetUrl.includes('yimg.com') && 
            !targetUrl.includes('flickr.com') && 
            !targetUrl.includes('search.yahoo')) {
          results.push({
            title: title || 'N/A',
            url: targetUrl
          });
        }
      } catch (e) {}
    }
  });

  // Deduplicate by URL
  const uniqueResults = [];
  const seenUrls = new Set();
  for (const item of results) {
    if (!seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      uniqueResults.push(item);
    }
  }

  console.log(`Extracted ${uniqueResults.length} organic search results from Yahoo:`);
  uniqueResults.forEach((res, index) => {
    console.log(`${index + 1}. Title: "${res.title}" | URL: ${res.url}`);
  });
}

extractYahooResults();
