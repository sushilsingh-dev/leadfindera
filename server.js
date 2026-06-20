const express = require('express');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Email scraping regex
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}/g;

// Excluded domains (V4 Data Quality Blacklist)
const EXCLUDED_DOMAINS = [
  // Job Sites
  'indeed.com', 'seek.com', 'seek.com.au', 'glassdoor.com', 'linkedin.com',
  // Social Platforms
  'facebook.com', 'instagram.com', 'instagram.co.uk', 'youtube.com', 'pinterest.com',
  'tiktok.com', 'snapchat.com', 'twitter.com', 'x.com', 'tumblr.com', 'reddit.com', 'quora.com',
  // News / Blogs / Information
  'theguardian.com', 'abc.net.au', 'smh.com.au', 'news.com.au', 'dailytelegraph.com.au',
  'refinery29.com', 'pedestrian.tv', 'sciencealert.com', 'famousbirthdays.com', 'nine.com.au',
  'wikipedia.org', 'msn.com', 'yahoo.com', 'google.com', 'microsoft.com', 'bing.com',
  // Directories / Reviews
  'yellowpages.com', 'yellowpages.com.au', 'houzz.com', 'wordofmouth.com.au', 'localbiznetwork.com',
  'infobel.com', 'productreview.com.au', 'yelp.com', 'yelp.co.uk', 'tripadvisor.com',
  'mapquest.com', 'foursquare.com', 'trustpilot.com',
  // Marketplaces / E-commerce Aggregators
  'amazon.com', 'amazon.co.uk', 'ebay.com', 'ebay.co.uk', 'etsy.com', 'craigslist.org',
  'booking.com', 'expedia.com', 'skyscanner.net',
  // Website builders placeholders
  'wixsite.com', 'blogspot.com', 'wordpress.com', 'github.com', 'uservoice.com',
  'apple.com', 'timeout.com', 'groupon.com', 'yimg.com', 'flickr.com'
];

function isDomainBlacklisted(domain) {
  if (!domain) return true;
  const cleanDomain = domain.toLowerCase();

  // Exact or sub-domain check
  const isExcluded = EXCLUDED_DOMAINS.some(d => cleanDomain === d || cleanDomain.endsWith('.' + d));
  if (isExcluded) return true;

  // Gov / Edu check (.gov, .edu, gov.au, edu.au, etc.)
  if (cleanDomain.endsWith('.gov') || cleanDomain.includes('.gov.') || cleanDomain.endsWith('.gov.au')) {
    return true;
  }
  if (cleanDomain.endsWith('.edu') || cleanDomain.includes('.edu.') || cleanDomain.endsWith('.edu.au')) {
    return true;
  }

  return false;
}

// Tracking/System Email domains
const TRACKING_EMAIL_DOMAINS = [
  'sentry.io', 'sentry.wixpress.com', 'sentry-next.wixpress.com', 'cloudflare.com',
  'zendesk.com', 'intercom.io', 'hubspot.com', 'mailchimp.com', 'sendgrid.net',
  'amazonses.com'
];

// Validate if email is a legitimate target (V4 Strict Filtering)
function isValidEmailTarget(email) {
  const lower = email.toLowerCase().trim();
  if (!lower.includes('@')) return false;

  const user = lower.split('@')[0];
  const domain = lower.split('@')[1] || '';

  // Reject exact email prefixes
  const badPrefixes = [
    'example', 'your', 'you', 'test', 'demo', 'sample', 'johndoe', 'john.doe',
    'firstname', 'lastname', 'user', 'fake', 'dummy', 'admin', 'name', 'email', 'contact'
  ];
  if (badPrefixes.includes(user)) return false;

  // Reject emails containing specific bad domain substrings
  const badDomainSubstrings = [
    'example.com', 'example.org', 'yourdomain', 'domain.com', 'company.com', 'test.com'
  ];
  if (badDomainSubstrings.some(sub => lower.includes(sub))) return false;

  // Reject tracking or system domains
  if (TRACKING_EMAIL_DOMAINS.includes(domain)) return false;

  // Other system-related bad prefixes
  const systemPrefixes = [
    'noreply', 'no-reply', 'do-not-reply', 'support-ticket', 'system', 'notification', 'mailer-daemon', 'postmaster'
  ];
  if (systemPrefixes.includes(user)) return false;

  return true;
}

// Email Quality Scoring
function getEmailQuality(email) {
  const lower = email.toLowerCase().trim();
  const user = lower.split('@')[0];
  const domain = lower.split('@')[1] || '';

  // HIGH: info@, contact@, sales@, hello@, office@
  const highPrefixes = ['info', 'contact', 'sales', 'hello', 'office'];
  if (highPrefixes.includes(user)) return 'High';

  // MEDIUM: support@, marketing@, service@, accounts@, admin@, enquiry@, owner@, director@, founder@
  const mediumPrefixes = ['support', 'marketing', 'service', 'accounts', 'admin', 'enquiry', 'owner', 'director', 'founder'];
  if (mediumPrefixes.includes(user)) return 'Medium';

  // LOW: gmail, hotmail, outlook, yahoo, icloud, aol
  const lowDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'aol.com', 'mail.com', 'zoho.com', 'yandex.com', 'protonmail.com', 'live.com', 'msn.com'];
  if (lowDomains.some(d => domain === d || domain.endsWith('.' + d))) return 'Low';

  return 'Medium';
}

// Extract Business Name
function extractBusinessName(html, domain) {
  let name = '';
  try {
    const $ = cheerio.load(html);
    
    // 1. JSON-LD Schema check
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html());
        if (data) {
          const schemas = Array.isArray(data) ? data : [data];
          for (const s of schemas) {
            if (s['@type'] === 'Organization' || s['@type'] === 'LocalBusiness' || s['@type'] === 'WebSite') {
              if (s.name) {
                name = s.name.trim();
                return false;
              }
            }
            if (s['@graph'] && Array.isArray(s['@graph'])) {
              for (const graphItem of s['@graph']) {
                if (graphItem['@type'] === 'Organization' || graphItem['@type'] === 'LocalBusiness' || graphItem['@type'] === 'WebSite') {
                  if (graphItem.name) {
                    name = graphItem.name.trim();
                    return false;
                  }
                }
              }
            }
          }
        }
      } catch (e) {}
    });

    if (name) return name;

    // 2. Metadata site name properties
    name = $('meta[property="og:site_name"]').attr('content') || 
           $('meta[name="application-name"]').attr('content') ||
           $('meta[property="og:title"]').attr('content') ||
           $('meta[name="twitter:title"]').attr('content');
    
    if (name) {
      name = name.trim();
      if (name.length > 50) name = name.slice(0, 47) + '...';
      return name;
    }

    // 3. Title tag
    const titleText = $('title').text().trim();
    if (titleText) {
      name = titleText.split(/[-|•|:|]/)[0].trim();
      if (name.length > 50) {
        name = name.slice(0, 47) + '...';
      }
      return name;
    }
  } catch (err) {}

  // 4. Domain fallback
  if (!name && domain) {
    const parts = domain.split('.');
    const raw = parts[0] === 'www' ? parts[1] : parts[0];
    name = raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  
  return name || 'Unknown Business';
}

// Extract Title & Meta Description
function extractMetaDetails(html) {
  let title = '';
  let description = '';
  try {
    const $ = cheerio.load(html);
    title = $('title').text().trim();
    description = $('meta[name="description"]').attr('content') || 
                  $('meta[property="og:description"]').attr('content') ||
                  $('meta[name="twitter:description"]').attr('content') || 
                  '';
    description = description.trim();
    if (description.length > 120) {
      description = description.slice(0, 117) + '...';
    }
  } catch (e) {}
  return { title, description };
}

// Classify email source page and placement (Source Type Heuristics)
function detectSourceType(pageUrl, isMailto = false, isFooter = false, isScript = false) {
  if (isMailto) return 'Mailto Link';
  if (isFooter) return 'Footer';
  if (isScript) return 'JSON-LD Schema';
  
  const path = pageUrl.toLowerCase();
  if (path.includes('contact') || path.includes('get-in-touch') || path.includes('touch')) return 'Contact Page';
  if (path.includes('about') || path.includes('team') || path.includes('company') || path.includes('staff')) return 'About Page';
  if (path.includes('support') || path.includes('help') || path.includes('customer')) return 'Support Page';
  
  // Check if it's homepage
  try {
    const parsed = new URL(pageUrl);
    if (parsed.pathname === '/' || parsed.pathname === '/index.html' || parsed.pathname === '/index.php') {
      return 'Homepage';
    }
  } catch (e) {}
  
  return 'Generic Page';
}

// Compute Smart Lead Score (0 to 100)
function calculateSmartLeadScore(emails, hasTitle, hasDesc, domain, hasPhone, hasAddress, isDirectory, isNews, isForum, isJob, industryMatch, category) {
  let score = 0;

  // Business indicators
  if (hasTitle && hasDesc) score += 25; // Business Website
  
  // Industry match
  if (industryMatch > 0) {
    score += (industryMatch * 25); 
  } else if (category && category !== 'Generic Business') {
    score += 15;
  }

  // Email adjustments
  if (emails.length > 0) {
    // 1. Quality level of emails
    const hasHigh = emails.some(e => e.quality === 'High');
    const hasMedium = emails.some(e => e.quality === 'Medium');
    if (hasHigh) score += 20; // Corporate Email
    else if (hasMedium) score += 10;

    // 2. Source Type priority weights
    const hasContact = emails.some(e => e.sourceType === 'Contact Page');
    const hasMailto = emails.some(e => e.sourceType === 'Mailto Link');
    const hasAbout = emails.some(e => e.sourceType === 'About Page');
    
    if (hasContact || hasMailto) score += 15;
    if (hasAbout) score += 10;
  } else {
    score -= 30; // Penalize heavily if no emails are found
  }

  // Valid Business Indicators
  if (hasPhone) score += 5;
  if (hasAddress) score += 5;

  // Domain Category Penalties
  if (isDirectory) score -= 50;
  if (isNews) score -= 60;
  if (isForum) score -= 70;
  if (isJob) score -= 80;

  // Domain checks for corporate vs free
  const lowDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'aol.com', 'mail.com'];
  const isCorporateDomain = !lowDomains.some(d => domain.includes(d));
  if (isCorporateDomain) score += 10;

  return Math.min(Math.max(score, 0), 100);
}

// Category Detection
function detectCategory(html, title, desc) {
  const text = (title + ' ' + desc).toLowerCase();
  
  if (text.includes('plumb')) return 'Plumber';
  if (text.includes('dentist') || text.includes('dental') || text.includes('orthodontist')) return 'Dentist';
  if (text.includes('lawyer') || text.includes('attorney') || text.includes('law firm') || text.includes('legal')) return 'Lawyer';
  if (text.includes('restaurant') || text.includes('cafe') || text.includes('dining') || text.includes('bistro')) return 'Restaurant';
  if (text.includes('shoe') || text.includes('footwear') || text.includes('sneaker')) return 'Footwear';
  if (text.includes('jewel') || text.includes('diamond') || text.includes('gold')) return 'Jewelry';
  if (text.includes('manufactur') || text.includes('factory') || text.includes('production')) return 'Manufacturer';
  if (text.includes('agency') || text.includes('marketing') || text.includes('advertising')) return 'Agency';
  if (text.includes('contractor') || text.includes('construction') || text.includes('builder')) return 'Contractor';
  if (text.includes('ecommerce') || text.includes('shop') || text.includes('store') || text.includes('boutique')) return 'Ecommerce';
  
  return 'Generic Business';
}

function detectNegativeCategories(html, title, desc) {
  const text = (title + ' ' + desc).toLowerCase();
  
  const isDirectory = /directory|listing|yellow pages|find a/i.test(text);
  const isNews = /news|article|blog|press release|journal/i.test(text);
  const isForum = /forum|community|board|discussion/i.test(text);
  const isJob = /jobs|careers|vacancies|hiring|recruitment/i.test(text);
  
  return { isDirectory, isNews, isForum, isJob };
}

// Check content relevance against searched industry keywords (V4 Quality Filter)
function validateContentRelevance(html, title, desc, keyword) {
  if (!keyword) return true;
  const kw = keyword.toLowerCase().trim();
  
  // Combine all text content to check
  const text = (title + ' ' + desc + ' ' + html).toLowerCase();

  // Keyword: Plumber / Plumbing
  if (kw.includes('plumb')) {
    const plumberTerms = ['plumber', 'plumbing', 'blocked drain', 'hot water', 'gas fitting', 'emergency plumbing', 'drainage', 'leak', 'pipe'];
    return plumberTerms.some(term => text.includes(term));
  }

  // Keyword: Dentist / Dental
  if (kw.includes('dentist') || kw.includes('dental') || kw.includes('teeth')) {
    const dentistTerms = ['dentist', 'dental', 'teeth', 'tooth', 'orthodontist', 'fillings', 'root canal', 'clinic'];
    return dentistTerms.some(term => text.includes(term));
  }

  // Keyword: Restaurant / Cafe
  if (kw.includes('restaurant') || kw.includes('cafe') || kw.includes('food') || kw.includes('dine') || kw.includes('dining')) {
    const restaurantTerms = ['restaurant', 'cafe', 'food', 'menu', 'dining', 'bistro', 'eat', 'cuisine', 'table booking'];
    return restaurantTerms.some(term => text.includes(term));
  }

  // General check: the keyword itself must appear in the content
  return text.includes(kw);
}

// In-memory Search History store
const searchHistory = [];

// Real URL Crawler & Email Extraction Logic
async function crawlDomain(domainUrl, logCallback, discoveryMethod = 'Direct Crawl', searchKeyword = '') {
  const formatted = formatUrl(domainUrl);
  let parsedUrl;
  try {
    parsedUrl = new URL(formatted);
  } catch (e) {
    logCallback(`[ERROR] Invalid URL format: ${domainUrl}`);
    return { url: domainUrl, emails: [], status: 'Invalid URL', businessName: domainUrl, title: '', description: '', leadScore: 0, category: 'Unknown' };
  }

  const hostname = parsedUrl.hostname;
  const origin = parsedUrl.origin;
  const emailsMap = {}; // email -> { email, quality, sourcePage, sourceType }
  const pagesVisited = new Set();
  const pagesToVisit = new Set([formatted]);
  let businessName = hostname.replace(/^www\./i, '');
  let webTitle = '';
  let webDesc = '';

  let hasPhone = false;
  let hasAddress = false;

  logCallback(`[START] Validating website: ${origin}`);

  try {
    // 1. Fetch homepage with timeout and retry
    const response = await axiosGetWithRetry(formatted, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 6000,
      validateStatus: () => true
    });

    if (response.status !== 200) {
      logCallback(`[ERROR] Skipped: ${origin} returned HTTP status ${response.status}`);
      return { url: formatted, emails: [], status: `HTTP ${response.status}`, businessName, title: '', description: '', leadScore: 0, category: 'Unknown' };
    }

    const html = response.data;
    if (typeof html !== 'string') {
      logCallback(`[ERROR] Skipped: ${origin} did not return valid HTML content.`);
      return { url: formatted, emails: [], status: 'Invalid Content', businessName, title: '', description: '', leadScore: 0, category: 'Unknown' };
    }

    // 2. Check for parked domains
    const isParked = /domain for sale|buy this domain|domain parked|under construction|this domain is parked|godaddy.*parked|sedo.*parked/i.test(html);
    if (isParked) {
      logCallback(`[ERROR] Skipped: ${origin} is identified as a parked domain.`);
      return { url: formatted, emails: [], status: 'Parked Domain', businessName, title: '', description: '', leadScore: 0, category: 'Unknown' };
    }

    // Extract basic business indicators from homepage HTML
    if (/tel:|\+?[0-9]{2,}\s?[0-9]{3,}\s?[0-9]{3,}/i.test(html)) hasPhone = true;
    if (/address|location|street|avenue|road|blvd/i.test(html)) hasAddress = true;

    // 3. Extract Business Name and Metadata details
    const normDomain = hostname.replace(/^www\./i, '').toLowerCase();
    businessName = extractBusinessName(html, normDomain);
    const metaDetails = extractMetaDetails(html);
    webTitle = metaDetails.title;
    webDesc = metaDetails.description;
    
    // Industry Relevance Check
    if (searchKeyword && !validateContentRelevance(html, webTitle, webDesc, searchKeyword)) {
      logCallback(`[ERROR] Skipped: ${origin} does not match industry relevance criteria for keyword "${searchKeyword}".`);
      return { url: formatted, emails: [], status: 'Irrelevant Website', businessName, title: webTitle, description: webDesc, leadScore: 0, category: 'Unknown' };
    }

    const category = detectCategory(html, webTitle, webDesc);
    const negs = detectNegativeCategories(html, webTitle, webDesc);
    
    let industryMatch = 0;
    if (searchKeyword) {
      const k = searchKeyword.toLowerCase();
      if ((webTitle + ' ' + webDesc).toLowerCase().includes(k)) {
         industryMatch = 1;
      }
    }

    logCallback(`[CRAWL] Reachable! Business identified as "${businessName}". Starting crawl.`);

    // Inner fetcher function for subpages
    async function fetchPage(pageUrl) {
      if (pagesVisited.has(pageUrl) || pagesVisited.size >= 4) return;
      pagesVisited.add(pageUrl);
      
      logCallback(`[CRAWL] Scanning page: ${pageUrl}`);
      try {
        const pageRes = await axiosGetWithRetry(pageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          timeout: 5000,
          validateStatus: () => true
        });

        if (pageRes.status !== 200 || typeof pageRes.data !== 'string') return;

        const pageHtml = pageRes.data;
        const $ = cheerio.load(pageHtml);
        const footerHtml = $('footer').html() || '';

        // Extract business indicators from subpages
        if (/tel:|\+?[0-9]{2,}\s?[0-9]{3,}\s?[0-9]{3,}/i.test(pageHtml)) hasPhone = true;
        if (/address|location|street|avenue|road|blvd/i.test(pageHtml)) hasAddress = true;

        // A. Extract mailto: links
        $('a[href^="mailto:"]').each((_, el) => {
          const mailto = $(el).attr('href').replace(/^mailto:/i, '').trim().split('?')[0];
          if (EMAIL_REGEX.test(mailto)) {
            const lower = mailto.toLowerCase();
            if (!/\.(png|jpg|jpeg|gif|css|js|svg|webp|ico|woff|woff2|mp4|ttf|eot)$/.test(lower) && isValidEmailTarget(lower)) {
              if (!emailsMap[lower]) {
                const q = getEmailQuality(lower);
                const sType = detectSourceType(pageUrl, true, false, false);
                emailsMap[lower] = { email: lower, quality: q, sourcePage: pageUrl, sourceType: sType };
                logCallback(`[EMAIL] Found mailto: ${lower} (Quality: ${q})`);
              }
            }
          }
        });

        // B. Extract emails from plain text / HTML
        const matches = pageHtml.match(EMAIL_REGEX);
        if (matches) {
          matches.forEach(email => {
            const lower = email.toLowerCase();
            if (!/\.(png|jpg|jpeg|gif|css|js|svg|webp|ico|woff|woff2|mp4|ttf|eot)$/.test(lower) && isValidEmailTarget(lower)) {
              if (!emailsMap[lower]) {
                const q = getEmailQuality(lower);
                const isFooter = footerHtml.toLowerCase().includes(lower);
                const sType = detectSourceType(pageUrl, false, isFooter, false);
                
                emailsMap[lower] = { email: lower, quality: q, sourcePage: pageUrl, sourceType: sType };
                logCallback(`[EMAIL] Found in text: ${lower} (Quality: ${q})`);
              }
            }
          });
        }

        // C. Extract emails from script tags
        $('script').each((_, script) => {
          try {
            const scriptText = $(script).html();
            if (scriptText) {
              const scriptMatches = scriptText.match(EMAIL_REGEX);
              if (scriptMatches) {
                scriptMatches.forEach(email => {
                  const lower = email.toLowerCase();
                  if (!/\.(png|jpg|jpeg|gif|css|js|svg|webp|ico|woff|woff2|mp4|ttf|eot)$/.test(lower) && isValidEmailTarget(lower)) {
                    if (!emailsMap[lower]) {
                      const q = getEmailQuality(lower);
                      const sType = detectSourceType(pageUrl, false, false, true);
                      emailsMap[lower] = { email: lower, quality: q, sourcePage: pageUrl + ' (JS State)', sourceType: sType };
                      logCallback(`[EMAIL] Found in script: ${lower} (Quality: ${q})`);
                    }
                  }
                });
              }
            }
          } catch (err) {}
        });

        // D. Queue internal contact page links from homepage
        if (pageUrl === formatted) {
          $('a[href]').each((_, el) => {
            const href = $(el).attr('href').trim();
            const text = $(el).text().toLowerCase();

            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
              return;
            }

            try {
              const resolvedUrl = new URL(href, pageUrl).toString();
              const resolvedParsed = new URL(resolvedUrl);

              if (resolvedParsed.hostname === parsedUrl.hostname) {
                const path = resolvedParsed.pathname.toLowerCase();
                const isContactLink = /contact|about|team|support|help|company|staff|office|touch|feedback/i.test(path) ||
                                      /contact|about|team|support|help|touch/i.test(text);

                if (isContactLink && !pagesVisited.has(resolvedUrl) && !pagesToVisit.has(resolvedUrl)) {
                  pagesToVisit.add(resolvedUrl);
                }
              }
            } catch (e) {}
          });
        }

      } catch (err) {
        logCallback(`[ERROR] Failed to crawl page ${pageUrl}: ${err.message}`);
      }
    }

    // Crawl homepage
    await fetchPage(formatted);

    // Crawl contact pages
    const subpages = Array.from(pagesToVisit).filter(url => url !== formatted).slice(0, 2);
    for (const pageUrl of subpages) {
      await fetchPage(pageUrl);
    }

    const emailList = Object.values(emailsMap);
    const score = calculateSmartLeadScore(emailList, !!webTitle, !!webDesc, normDomain, hasPhone, hasAddress, negs.isDirectory, negs.isNews, negs.isForum, negs.isJob, industryMatch, category);

    logCallback(`[FINISH] Scanned ${origin}. Found ${emailList.length} unique emails. Lead Score: ${score}/100.`);
    return {
      url: formatted,
      emails: emailList,
      status: emailList.length > 0 ? 'Success' : 'No Emails Found',
      businessName,
      title: webTitle,
      description: webDesc,
      leadScore: score,
      category: category,
      discoveryMethod
    };

  } catch (err) {
    logCallback(`[ERROR] Connection failed for ${origin}: ${err.message}`);
    return { url: formatted, emails: [], status: 'Connection Failed', businessName, title: '', description: '', leadScore: 0, category: 'Unknown' };
  }
}

// Search Scrapers
async function scrapeYahooSearch(query, maxResults) {
  const urls = [];
  const pages = Math.ceil(maxResults / 10);
  
  for (let pageIndex = 0; pageIndex < pages; pageIndex++) {
    const startIndex = pageIndex * 10 + 1;
    const url = `https://search.yahoo.com/search?p=${encodeURIComponent(query)}&b=${startIndex}`;
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
        timeout: 6000
      });
      const $ = cheerio.load(response.data);
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('r.search.yahoo.com')) {
          const ruMatch = href.match(/\/RU=([^/]+)/);
          if (ruMatch) {
            try {
              const targetUrl = decodeURIComponent(ruMatch[1]);
              if (targetUrl.startsWith('http')) urls.push(targetUrl);
            } catch (e) {}
          }
        }
      });
    } catch (err) {}
  }
  return urls;
}

async function scrapeAskSearch(query, maxResults) {
  const urls = [];
  const pages = Math.ceil(maxResults / 10);
  
  for (let pageIndex = 0; pageIndex < pages; pageIndex++) {
    const url = `https://www.ask.com/web?q=${encodeURIComponent(query)}&page=${pageIndex + 1}`;
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
        timeout: 6000
      });
      const $ = cheerio.load(response.data);
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith('http') && !href.includes('ask.com') && !href.includes('google.com')) {
          urls.push(href);
        }
      });
    } catch (err) {}
  }
  return urls;
}

async function scrapeAolSearch(query, maxResults) {
  const urls = [];
  const pages = Math.ceil(maxResults / 10);
  
  for (let pageIndex = 0; pageIndex < pages; pageIndex++) {
    const startIndex = pageIndex * 10 + 1;
    const url = `https://search.aol.com/aol/search?q=${encodeURIComponent(query)}&b=${startIndex}`;
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
        timeout: 6000
      });
      const $ = cheerio.load(response.data);
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && (href.includes('r.search.aol.com') || href.includes('r.search.yahoo.com'))) {
          const ruMatch = href.match(/\/RU=([^/]+)/);
          if (ruMatch) {
            try {
              const targetUrl = decodeURIComponent(ruMatch[1]);
              if (targetUrl.startsWith('http')) urls.push(targetUrl);
            } catch (e) {}
          }
        }
      });
    } catch (err) {}
  }
  return urls;
}

async function scrapeBingSearch(query, maxResults) {
  const urls = [];
  const pages = Math.ceil(maxResults / 10);
  
  for (let pageIndex = 0; pageIndex < pages; pageIndex++) {
    const startIndex = pageIndex * 10 + 1;
    const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&first=${startIndex}`;
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 6000
      });
      const $ = cheerio.load(response.data);
      $('.b_algo h2 a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith('http') && !href.includes('bing.com')) {
          urls.push(href);
        }
      });
    } catch (err) {}
  }
  return urls;
}

async function scrapeDuckDuckGoSearch(query, maxResults) {
  const urls = [];
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      },
      timeout: 6000
    });
    const $ = cheerio.load(response.data);
    $('a.result__url').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        if (href.startsWith('http')) {
          urls.push(href);
        } else if (href.includes('uddg=')) {
          const match = href.match(/uddg=([^&]+)/);
          if (match) {
            try {
              urls.push(decodeURIComponent(match[1]));
            } catch (e) {}
          }
        }
      }
    });
  } catch (err) {}
  return urls;
}

// Master Multi-Source Resolver with fallbacks
async function discoverRealWebsites(query, maxResults, logCallback, debugInfo) {
  let urls = [];
  
  // 1. Bing Search
  logCallback(`[SEARCH] Querying Bing Search for: "${query}"...`);
  if (debugInfo) debugInfo.providerUsed = 'Bing Search';
  try {
    urls = await scrapeBingSearch(query, maxResults);
  } catch (err) {
    logCallback(`[WARN] Bing Search failed: ${err.message}`);
  }
  
  // 2. DuckDuckGo Search
  if (urls.length < 3) {
    logCallback(`[SEARCH] Bing returned low results (${urls.length}). Trying DuckDuckGo Search...`);
    if (debugInfo) debugInfo.providerUsed = 'DuckDuckGo Search';
    try {
      const ddgUrls = await scrapeDuckDuckGoSearch(query, maxResults);
      urls = urls.concat(ddgUrls);
    } catch (err) {
      logCallback(`[WARN] DuckDuckGo Search failed: ${err.message}`);
    }
  }

  // 3. Yahoo Search
  if (urls.length < 5) {
    logCallback(`[SEARCH] DuckDuckGo returned low results. Trying Yahoo Search...`);
    if (debugInfo) debugInfo.providerUsed = 'Yahoo Search';
    try {
      const yahooUrls = await scrapeYahooSearch(query, maxResults);
      urls = urls.concat(yahooUrls);
    } catch (err) {
      logCallback(`[WARN] Yahoo Search failed: ${err.message}`);
    }
  }

  // 4. AOL Search
  if (urls.length < 8) {
    logCallback(`[SEARCH] Yahoo returned low results. Trying AOL Search...`);
    if (debugInfo) debugInfo.providerUsed = 'AOL Search';
    try {
      const aolUrls = await scrapeAolSearch(query, maxResults);
      urls = urls.concat(aolUrls);
    } catch (err) {
      logCallback(`[WARN] AOL Search failed: ${err.message}`);
    }
  }

  // Deduplicate and filter domains
  const filteredUrls = [];
  const seenDomains = new Set();
  let domainsFilteredCount = 0;
  
  for (const urlStr of urls) {
    const domain = extractDomain(urlStr);
    if (!domain) continue;
    
    const isExcluded = isDomainBlacklisted(domain);
    if (isExcluded) {
      domainsFilteredCount++;
      continue;
    }
    
    if (!seenDomains.has(domain)) {
      seenDomains.add(domain);
      filteredUrls.push(urlStr);
    }
  }
  
  if (debugInfo) {
    debugInfo.websitesFound += filteredUrls.length;
    debugInfo.domainsFiltered += domainsFilteredCount;
  }
  
  logCallback(`[SEARCH] Completed discovery. Found ${filteredUrls.length} unique business websites.`);
  return filteredUrls;
}

// Async Pool Concurrency Helper
async function runConcurrentCrawls(urls, concurrency, task) {
  const results = [];
  const queue = [...urls];
  const activePromises = [];
  
  while (queue.length > 0 || activePromises.length > 0) {
    while (activePromises.length < concurrency && queue.length > 0) {
      const url = queue.shift();
      const promise = task(url).then(res => {
        activePromises.splice(activePromises.indexOf(promise), 1);
        return res;
      });
      activePromises.push(promise);
      results.push(promise);
    }
    if (activePromises.length > 0) {
      await Promise.race(activePromises);
    }
  }
  return Promise.all(results);
}

// API: Get History
app.get('/api/history', (req, res) => {
  res.json(searchHistory);
});

// API: Clear History
const postClearHistory = (req, res) => {
  searchHistory.length = 0;
  res.json({ success: true });
};
app.post('/api/history/clear', postClearHistory);

// API Endpoint for Search (Server-Sent Events)
app.get('/api/search', async (req, res) => {
  const { keyword, country, city, maxResults } = req.query;

  if (!keyword || !country) {
    return res.status(400).json({ error: 'Keyword and Country are required.' });
  }

  const limit = parseInt(maxResults) || 50;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const historyItem = {
    id: uuidv4(),
    keyword,
    country,
    city: city || 'All Cities',
    maxResults: limit,
    timestamp: new Date().toISOString(),
    resultCount: 0
  };
  searchHistory.unshift(historyItem);

  const searchQueries = [
    city ? `"${keyword}" "${city}" "${country}"` : `"${keyword}" "${country}"`,
    `${keyword} company ${city || ''} ${country}`,
    `${keyword} services ${city || ''} ${country}`
  ].map(q => q.trim().replace(/\s+/g, ' '));

  res.write(`data: ${JSON.stringify({ type: 'start', queries: searchQueries })}\n\n`);

  const debugInfo = {
    generatedQueries: [...searchQueries],
    providerUsed: 'Bing Search',
    websitesFound: 0,
    domainsFiltered: 0,
    emailsExtracted: 0
  };

  let allUrls = [];
  const logCallback = (msg) => {
    res.write(`data: ${JSON.stringify({ type: 'log', message: msg })}\n\n`);
  };

  // Initial debug state emission
  res.write(`data: ${JSON.stringify({ type: 'debug', debug: debugInfo })}\n\n`);

  try {
    for (const q of searchQueries.slice(0, 2)) {
      const urls = await discoverRealWebsites(q, Math.max(12, limit / 2), logCallback, debugInfo);
      allUrls = allUrls.concat(urls);
      res.write(`data: ${JSON.stringify({ type: 'debug', debug: debugInfo })}\n\n`);
    }
  } catch (err) {
    logCallback(`[ERROR] Search scraping issue: ${err.message}`);
  }

  // Deduplicate helper
  const deduplicate = (urlsList) => {
    const list = [];
    const seen = new Set();
    for (const url of urlsList) {
      const domain = extractDomain(url);
      if (domain && !seen.has(domain)) {
        seen.add(domain);
        list.push(url);
      }
    }
    return list;
  };

  let uniqueUrls = deduplicate(allUrls);

  // Automatic retry if search results = 0
  if (uniqueUrls.length === 0) {
    logCallback(`[WARN] No results found. Automatically retrying with broader variations...`);
    
    const retryQueries = [
      `${keyword} ${country}`,
      city ? `${keyword} ${city}` : null,
      `${keyword} industry`,
      keyword
    ].filter(Boolean);

    for (const rQuery of retryQueries) {
      if (uniqueUrls.length >= 5) break;
      logCallback(`[RETRY] Trying: "${rQuery}"...`);
      debugInfo.generatedQueries.push(rQuery);
      res.write(`data: ${JSON.stringify({ type: 'debug', debug: debugInfo })}\n\n`);
      
      try {
        const urls = await discoverRealWebsites(rQuery, 10, logCallback, debugInfo);
        allUrls = allUrls.concat(urls);
        uniqueUrls = deduplicate(allUrls);
        res.write(`data: ${JSON.stringify({ type: 'debug', debug: debugInfo })}\n\n`);
      } catch (err) {}
    }
  }

  const targets = uniqueUrls.slice(0, limit);
  logCallback(`[SEARCH] Final discovery list: ${targets.length} websites prepared for concurrency pool.`);

  if (targets.length === 0) {
    logCallback(`[WARN] No business websites found. Suggesting alternative inputs.`);
    res.write(`data: ${JSON.stringify({ type: 'complete', totalFound: 0 })}\n\n`);
    res.end();
    return;
  }

  let itemsCrawled = 0;
  let successCount = 0;

  // Run in concurrent chunks of 3 for fast, parallel real-time streaming
  await runConcurrentCrawls(targets, 3, async (url) => {
    const result = await crawlDomain(url, logCallback, 'FindEmailsPro Search Engine', keyword);
    itemsCrawled++;

    if (result.status !== 'Connection Failed' && result.status !== 'Parked Domain' && result.status !== 'Invalid Content') {
      successCount++;
      debugInfo.emailsExtracted += result.emails.length;
      
      res.write(`data: ${JSON.stringify({
        type: 'result',
        lead: {
          businessName: result.businessName,
          website: result.url,
          emails: result.emails,
          country: country,
          status: result.status,
          title: result.title,
          description: result.description,
          leadScore: result.leadScore,
          category: result.category,
          discoveryMethod: result.discoveryMethod
        }
      })}\n\n`);
    }

    // Push real-time debug update to UI
    res.write(`data: ${JSON.stringify({ type: 'debug', debug: debugInfo })}\n\n`);

    res.write(`data: ${JSON.stringify({
      type: 'progress',
      current: itemsCrawled,
      total: targets.length
    })}\n\n`);
  });

  historyItem.resultCount = successCount;

  res.write(`data: ${JSON.stringify({ type: 'complete', totalFound: successCount })}\n\n`);
  res.end();
});

// API Endpoint for Direct URL Crawling (Server-Sent Events)
app.get('/api/crawl-urls', async (req, res) => {
  const { urls } = req.query;

  if (!urls) {
    return res.status(400).json({ error: 'URLs are required.' });
  }

  const rawList = urls.split(',').map(u => u.trim()).filter(u => u.length > 0);
  const urlList = [];
  const logCallback = (msg) => {
    res.write(`data: ${JSON.stringify({ type: 'log', message: msg })}\n\n`);
  };

  for (const url of rawList) {
    const domain = extractDomain(url);
    if (domain && isDomainBlacklisted(domain)) {
      logCallback(`[EXCLUDE] Domain "${domain}" is on the blacklist and was skipped before crawling.`);
    } else if (domain) {
      urlList.push(url);
    }
  }

  if (urlList.length === 0) {
    return res.status(400).json({ error: 'No valid non-blacklisted URLs provided.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: ${JSON.stringify({ type: 'start', totalUrls: urlList.length })}\n\n`);

  let itemsCrawled = 0;

  await runConcurrentCrawls(urlList, 3, async (url) => {
    res.write(`data: ${JSON.stringify({ type: 'log', message: `[QUEUE] Crawling website directly: ${url}` })}\n\n`);
    const result = await crawlDomain(url, logCallback, 'Direct URL Crawler', '');
    itemsCrawled++;

    if (result.status !== 'Connection Failed' && result.status !== 'Parked Domain' && result.status !== 'Invalid Content') {
      res.write(`data: ${JSON.stringify({
        type: 'result',
        lead: {
          businessName: result.businessName,
          website: result.url,
          emails: result.emails,
          country: 'Real-Time',
          status: result.status,
          title: result.title,
          description: result.description,
          leadScore: result.leadScore,
          category: result.category,
          discoveryMethod: result.discoveryMethod
        }
      })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({
      type: 'progress',
      current: itemsCrawled,
      total: urlList.length
    })}\n\n`);
  });

  res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`);
  res.end();
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`FindEmailsPro Lead Finder running on http://localhost:${PORT}`);
});
