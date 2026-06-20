const axios = require('axios');
const fs = require('fs');

async function dumpFullHtml() {
  try {
    const response = await axios.get(`https://html.duckduckgo.com/html/?q=shoes+london+uk`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    fs.writeFileSync('C:\\Users\\DELL\\.gemini\\antigravity\\brain\\6f7d5a04-1e4f-4d88-90ea-1e683189c13d\\scratch\\ddg_response.html', response.data);
    console.log("Saved full response to ddg_response.html");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

dumpFullHtml();
