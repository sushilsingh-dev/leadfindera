const axios = require('axios');
const cheerio = require('cheerio');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const EXCLUDED_DOMAINS = [
  'yahoo.com', 'google.com', 'microsoft.com', 'bing.com', 'facebook.com', 'twitter.com',
  'instagram.com', 'linkedin.com', 'youtube.com', 'pinterest.com', 'amazon.com',
  'wikipedia.org', 'yelp.com', 'tripadvisor.com', 'yellowpages.com', 'mapquest.com',
  'foursquare.com', 'apple.com', 'timeout.com', 'groupon.com', 'yimg.com', 'flickr.com',
  'tumblr.com', 'reddit.com'
];

function extractDomain(urlString) {
  try {
    const parsed = new URL(urlString);
    return parsed.hostname.replace(/^www\./i, '');
  } catch (e) {
    return null;
  }
}

async function searchYahoo(query) {
  console.log(`[SEARCH] Querying Yahoo for: "${query}"`);
  try {
    const response = await axios.get(`https://search.yahoo.com/search?p=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': USER_AGENT }
    });
    const $ = cheerio.load(response.data);
    const urls = [];
    
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('r.search.yahoo.com')) {
        const ruMatch = href.match(/\/RU=([^/]+)/);
        if (ruMatch) {
          try {
            const targetUrl = decodeURIComponent(ruMatch[1]);
            if (targetUrl.startsWith('http')) {
              urls.push(targetUrl);
            }
          } catch (e) {}
        }
      }
    });

    // Deduplicate and filter domains
    const filteredUrls = [];
    const seenDomains = new Set();
    
    for (const urlStr of urls) {
      const domain = extractDomain(urlStr);
      if (!domain) continue;
      
      const isExcluded = EXCLUDED_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
      if (isExcluded) continue;
      
      if (!seenDomains.has(domain)) {
        seenDomains.add(domain);
        filteredUrls.push(urlStr);
      }
    }
    
    console.log(`[SEARCH] Found ${filteredUrls.length} unique business URLs.`);
    return filteredUrls;
  } catch (error) {
    console.error('[SEARCH ERROR] Yahoo failed:', error.message);
    return [];
  }
}

async function validateAndCrawl(urlStr) {
  console.log(`\n[VALIDATE] Checking reachability: ${urlStr}`);
  try {
    // 1. Fetch homepage with timeout
    const response = await axios.get(urlStr, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 5000,
      validateStatus: () => true
    });

    if (response.status !== 200) {
      console.log(`[VALIDATE] Skipped: Returns HTTP status ${response.status}`);
      return null;
    }

    const html = response.data;
    if (typeof html !== 'string') {
      console.log(`[VALIDATE] Skipped: Response is not HTML text.`);
      return null;
    }

    // 2. Check for parked domains
    const isParked = /domain for sale|buy this domain|domain parked|under construction|this domain is parked|godaddy.*parked|sedo.*parked/i.test(html);
    if (isParked) {
      console.log(`[VALIDATE] Skipped: Parked domain detected.`);
      return null;
    }

    console.log(`[CRAWL] Reachable! Starting email extraction...`);
    const emails = new Set();
    const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}/g;

    // Search homepage
    const homepageMatches = html.match(EMAIL_REGEX);
    if (homepageMatches) {
      homepageMatches.forEach(email => {
        const lower = email.toLowerCase();
        if (!/\.(png|jpg|jpeg|gif|css|js|svg|webp|ico|woff|woff2|mp4|ttf|eot)$/.test(lower)) {
          emails.add(lower);
        }
      });
    }

    // Search for contact page links
    const $ = cheerio.load(html);
    const pagesToVisit = new Set();
    
    $('a[href]').each((i, el) => {
      const href = $(el).attr('href').trim();
      const text = $(el).text().toLowerCase();
      
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        return;
      }
      
      try {
        const resolvedUrl = new URL(href, urlStr).toString();
        const resolvedParsed = new URL(resolvedUrl);
        const originParsed = new URL(urlStr);
        
        if (resolvedParsed.hostname === originParsed.hostname) {
          const path = resolvedParsed.pathname.toLowerCase();
          const isContactLink = /contact|about|team|support|help|company/i.test(path) ||
                                /contact|about|team|support|help/i.test(text);
          if (isContactLink) {
            pagesToVisit.add(resolvedUrl);
          }
        }
      } catch (e) {}
    });

    // Crawl subpages
    const subpages = Array.from(pagesToVisit).slice(0, 2);
    for (const subpageUrl of subpages) {
      console.log(`[CRAWL] Fetching subpage: ${subpageUrl}`);
      try {
        const subRes = await axios.get(subpageUrl, {
          headers: { 'User-Agent': USER_AGENT },
          timeout: 5000,
          validateStatus: () => true
        });
        
        if (subRes.status === 200 && typeof subRes.data === 'string') {
          const subMatches = subRes.data.match(EMAIL_REGEX);
          if (subMatches) {
            subMatches.forEach(email => {
              const lower = email.toLowerCase();
              if (!/\.(png|jpg|jpeg|gif|css|js|svg|webp|ico|woff|woff2|mp4|ttf|eot)$/.test(lower)) {
                emails.add(lower);
              }
            });
          }
        }
      } catch (err) {
        console.log(`[CRAWL ERROR] Failed to fetch subpage ${subpageUrl}: ${err.message}`);
      }
    }

    const emailList = Array.from(emails);
    console.log(`[RESULT] Finished ${urlStr}. Found ${emailList.length} emails:`, emailList);
    return {
      url: urlStr,
      emails: emailList,
      status: emailList.length > 0 ? 'Success' : 'No Emails Found'
    };
  } catch (error) {
    console.log(`[VALIDATE ERROR] Failed to connect: ${error.message}`);
    return null;
  }
}

async function testFullFlow() {
  const query = 'Shoes London UK';
  const urls = await searchYahoo(query);
  
  // Test validation & crawling for the first 3 URLs
  const targets = urls.slice(0, 3);
  for (const urlStr of targets) {
    await validateAndCrawl(urlStr);
  }
}

testFullFlow();
