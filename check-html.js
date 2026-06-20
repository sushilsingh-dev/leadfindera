const axios = require('axios');
const fs = require('fs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function dumpResponses() {
  try {
    const bingRes = await axios.get('https://www.bing.com/search?q=shoes+london+uk', {
      headers: { 'User-Agent': USER_AGENT }
    });
    fs.writeFileSync('bing_res.html', bingRes.data);
    console.log(`Bing HTML length: ${bingRes.data.length}. Saved to bing_res.html.`);
  } catch (err) {
    console.error('Bing Err:', err.message);
  }

  try {
    const ddgRes = await axios.post('https://lite.duckduckgo.com/lite/', 'q=shoes+london+uk', {
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    fs.writeFileSync('ddg_lite_res.html', ddgRes.data);
    console.log(`DDG Lite HTML length: ${ddgRes.data.length}. Saved to ddg_lite_res.html.`);
  } catch (err) {
    console.error('DDG Lite Err:', err.message);
  }
}

dumpResponses();
