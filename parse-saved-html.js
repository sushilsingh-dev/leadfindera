const fs = require('fs');
const cheerio = require('cheerio');

function parseBing() {
  console.log('=== Parsing Bing HTML ===');
  const html = fs.readFileSync('bing_res.html', 'utf8');
  
  if (html.includes('captcha') || html.includes('Anomaly') || html.includes('security check')) {
    console.log('Bing page appears to be a CAPTCHA or blocking page.');
  } else {
    console.log('Bing page does not seem to contain blocking text.');
  }

  const $ = cheerio.load(html);
  
  // Let's print out all links that start with http/https
  const links = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && href.startsWith('http') && !href.includes('bing.com') && !href.includes('microsoft.com')) {
      links.push(href);
    }
  });

  console.log(`Found ${links.length} external links in Bing:`);
  console.log(links.slice(0, 10));
}

function parseDdgLite() {
  console.log('\n=== Parsing DDG Lite HTML ===');
  const html = fs.readFileSync('ddg_lite_res.html', 'utf8');
  
  if (html.includes('captcha') || html.includes('Anomaly') || html.includes('security check') || html.includes('anomaly-modal')) {
    console.log('DDG Lite page appears to be a CAPTCHA or blocking page.');
  } else {
    console.log('DDG Lite page does not seem to contain blocking text.');
  }

  const $ = cheerio.load(html);
  const links = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && href.startsWith('http') && !href.includes('duckduckgo.com')) {
      links.push(href);
    }
  });

  console.log(`Found ${links.length} external links in DDG Lite:`);
  console.log(links.slice(0, 10));
}

parseBing();
parseDdgLite();
