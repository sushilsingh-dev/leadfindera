const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function testYahoo(query) {
  console.log(`Searching Yahoo for: "${query}"`);
  try {
    const response = await axios.get(`https://search.yahoo.com/search?p=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': USER_AGENT }
    });
    fs.writeFileSync('yahoo_res.html', response.data);
    console.log(`Yahoo HTML length: ${response.data.length}. Saved to yahoo_res.html.`);

    const $ = cheerio.load(response.data);
    const links = [];
    
    // Yahoo search result links are usually in elements with class 'ac-21th' or inside 'h3.title a'
    $('h3.title a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http')) {
        links.push(href);
      }
    });

    console.log(`Found ${links.length} links inside Yahoo search results.`);
    console.log(links.slice(0, 5));
    return links;
  } catch (error) {
    console.error('Yahoo Error:', error.message);
    return [];
  }
}

testYahoo('Shoes London UK');
