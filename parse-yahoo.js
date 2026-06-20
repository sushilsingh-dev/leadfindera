const fs = require('fs');
const cheerio = require('cheerio');

function parseYahoo() {
  const html = fs.readFileSync('yahoo_res.html', 'utf8');
  const $ = cheerio.load(html);
  
  console.log("Yahoo HTML structure check:");
  
  if (html.includes('consent.yahoo.com')) {
    console.log("Warning: Yahoo redirecting to a consent/cookie page!");
    return;
  }
  
  const hrefs = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href && href.startsWith('http')) {
      hrefs.push({ href, text });
    }
  });

  console.log(`Total URLs found in Yahoo response: ${hrefs.length}`);
  console.log("First 20 URLs:");
  console.log(hrefs.slice(0, 20));
}

parseYahoo();
