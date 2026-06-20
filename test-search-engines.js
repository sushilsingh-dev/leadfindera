const axios = require('axios');
const cheerio = require('cheerio');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function testBing(query) {
  console.log(`--- Testing Bing for: "${query}" ---`);
  try {
    const response = await axios.get(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': USER_AGENT }
    });
    const $ = cheerio.load(response.data);
    const links = [];
    $('li.b_algo h2 a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http')) {
        links.push(href);
      }
    });
    console.log(`Bing: Found ${links.length} results.`);
    console.log(links.slice(0, 5));
    return links;
  } catch (error) {
    console.error('Bing Error:', error.message);
    return [];
  }
}

async function testDdgLite(query) {
  console.log(`--- Testing DDG Lite for: "${query}" ---`);
  try {
    const response = await axios.post('https://lite.duckduckgo.com/lite/', `q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const $ = cheerio.load(response.data);
    const links = [];
    $('a.result-link').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http')) {
        links.push(href);
      }
    });
    console.log(`DDG Lite: Found ${links.length} results.`);
    console.log(links.slice(0, 5));
    return links;
  } catch (error) {
    console.error('DDG Lite Error:', error.message);
    return [];
  }
}

async function testAsk(query) {
  console.log(`--- Testing Ask.com for: "${query}" ---`);
  try {
    const response = await axios.get(`https://www.ask.com/web?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': USER_AGENT }
    });
    const $ = cheerio.load(response.data);
    const links = [];
    $('.PartialSearchResults-item-title a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http')) {
        links.push(href);
      }
    });
    console.log(`Ask.com: Found ${links.length} results.`);
    console.log(links.slice(0, 5));
    return links;
  } catch (error) {
    console.error('Ask.com Error:', error.message);
    return [];
  }
}

async function runTests() {
  const query = 'Shoes London UK';
  await testBing(query);
  await testDdgLite(query);
  await testAsk(query);
}

runTests();
