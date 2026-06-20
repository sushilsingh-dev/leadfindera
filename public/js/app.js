// ISO Countries Database
const ISO_COUNTRIES = {
  "AF": "Afghanistan", "AX": "Aland Islands", "AL": "Albania", "DZ": "Algeria", "AS": "American Samoa", "AD": "Andorra", "AO": "Angola", "AI": "Anguilla", "AQ": "Antarctica", "AG": "Antigua and Barbuda", "AR": "Argentina", "AM": "Armenia", "AW": "Aruba", "AU": "Australia", "AT": "Austria", "AZ": "Azerbaijan", "BS": "Bahamas", "BH": "Bahrain", "BD": "Bangladesh", "BB": "Barbados", "BY": "Belarus", "BE": "Belgium", "BZ": "Belize", "BJ": "Benin", "BM": "Bermuda", "BT": "Bhutan", "BO": "Bolivia", "BQ": "Bonaire, Sint Eustatius and Saba", "BA": "Bosnia and Herzegovina", "BW": "Botswana", "BV": "Bouvet Island", "BR": "Brazil", "IO": "British Indian Ocean Territory", "BN": "Brunei Darussalam", "BG": "Bulgaria", "BF": "Burkina Faso", "BI": "Burundi", "CV": "Cabo Verde", "KH": "Cambodia", "CM": "Cameroon", "CA": "Canada", "KY": "Cayman Islands", "CF": "Central African Republic", "TD": "Chad", "CL": "Chile", "CN": "China", "CX": "Christmas Island", "CC": "Cocos (Keeling) Islands", "CO": "Colombia", "KM": "Comoros", "CD": "Congo (Democratic Republic of)", "CG": "Congo (Republic of)", "CK": "Cook Islands", "CR": "Costa Rica", "CI": "Côte d'Ivoire", "HR": "Croatia", "CU": "Cuba", "CW": "Curaçao", "CY": "Cyprus", "CZ": "Czechia", "DK": "Denmark", "DJ": "Djibouti", "DM": "Dominica", "DO": "Dominican Republic", "EC": "Ecuador", "EG": "Egypt", "SV": "El Salvador", "GQ": "Equatorial Guinea", "ER": "Eritrea", "EE": "Estonia", "SZ": "Eswatini", "ET": "Ethiopia", "FK": "Falkland Islands (Malvinas)", "FO": "Faroe Islands", "FJ": "Fiji", "FI": "Finland", "FR": "France", "GF": "French Guiana", "PF": "French Polynesia", "TF": "French Southern Territories", "GA": "Gabon", "GM": "Gambia", "GE": "Georgia", "DE": "Germany", "GH": "Ghana", "GI": "Gibraltar", "GR": "Greece", "GL": "Greenland", "GD": "Grenada", "GP": "Guadeloupe", "GU": "Guam", "GT": "Guatemala", "GG": "Guernsey", "GN": "Guinea", "GW": "Guinea-Bissau", "GY": "Guyana", "HT": "Haiti", "HM": "Heard Island and McDonald Islands", "VA": "Holy See", "HN": "Honduras", "HK": "Hong Kong", "HU": "Hungary", "IS": "Iceland", "IN": "India", "ID": "Indonesia", "IR": "Iran", "IQ": "Iraq", "IE": "Ireland", "IM": "Isle of Man", "IL": "Israel", "IT": "Italy", "JM": "Jamaica", "JP": "Japan", "JE": "Jersey", "JO": "Jordan", "KZ": "Kazakhstan", "KE": "Kenya", "KI": "Kiribati", "KP": "Korea (Democratic People's Republic of)", "KR": "Korea (Republic of)", "KW": "Kuwait", "KG": "Kyrgyzstan", "LA": "Lao People's Democratic Republic", "LV": "Latvia", "LB": "Lebanon", "LS": "Lesotho", "LR": "Liberia", "LY": "Libya", "LI": "Liechtenstein", "LT": "Lithuania", "LU": "Luxembourg", "MO": "Macao", "MG": "Madagascar", "MW": "Malawi", "MY": "Malaysia", "MV": "Maldives", "ML": "Mali", "MT": "Malta", "MH": "Marshall Islands", "MQ": "Martinique", "MR": "Mauritania", "MU": "Mauritius", "YT": "Mayotte", "MX": "Mexico", "FM": "Micronesia", "MD": "Moldova", "MC": "Monaco", "MN": "Mongolia", "ME": "Montenegro", "MS": "Montserrat", "MA": "Morocco", "MZ": "Mozambique", "MM": "Myanmar", "NA": "Namibia", "NR": "Nauru", "NP": "Nepal", "NL": "Netherlands", "NC": "New Caledonia", "NZ": "New Zealand", "NI": "Nicaragua", "NE": "Niger", "NG": "Nigeria", "NU": "Niue", "NF": "Norfolk Island", "MP": "Northern Mariana Islands", "NO": "Norway", "OM": "Oman", "PK": "Pakistan", "PW": "Palau", "PS": "Palestine, State of", "PA": "Panama", "PG": "Papua New Guinea", "PY": "Paraguay", "PE": "Peru", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PT": "Portugal", "PR": "Puerto Rico", "QA": "Qatar", "RE": "Réunion", "RO": "Romania", "RU": "Russian Federation", "RW": "Rwanda", "BL": "Saint Barthélemy", "SH": "Saint Helena, Ascension and Tristan da Cunha", "KN": "Saint Kitts and Nevis", "LC": "Saint Lucia", "MF": "Saint Martin (French part)", "PM": "Saint Pierre and Miquelon", "VC": "Saint Vincent and the Grenadines", "WS": "Samoa", "SM": "San Marino", "ST": "Sao Tome and Principe", "SA": "Saudi Arabia", "SN": "Senegal", "RS": "Serbia", "SC": "Seychelles", "SL": "Sierra Leone", "SG": "Singapore", "SX": "Sint Maarten (Dutch part)", "SK": "Slovakia", "SI": "Slovenia", "SB": "Solomon Islands", "SO": "Somalia", "ZA": "South Africa", "GS": "South Georgia and the South Sandwich Islands", "SS": "South Sudan", "ES": "Spain", "LK": "Sri Lanka", "SD": "Sudan", "SR": "Suriname", "SJ": "Svalbard and Jan Mayen", "SE": "Sweden", "CH": "Switzerland", "SY": "Syrian Arab Republic", "TW": "Taiwan", "TJ": "Tajikistan", "TZ": "Tanzania", "TH": "Thailand", "TL": "Timor-Leste", "TG": "Togo", "TK": "Tokelau", "TO": "Tonga", "TT": "Trinidad and Tobago", "TN": "Tunisia", "TR": "Turkey", "TM": "Turkmenistan", "TC": "Turks and Caicos Islands", "TV": "Tuvalu", "UG": "Uganda", "UA": "Ukraine", "AE": "United Arab Emirates", "GB": "United Kingdom", "US": "United States", "UM": "United States Minor Outlying Islands", "UY": "Uruguay", "UZ": "Uzbekistan", "VU": "Vanuatu", "VE": "Venezuela", "VN": "Viet Nam", "VG": "Virgin Islands (British)", "VI": "Virgin Islands (U.S.)", "WF": "Wallis and Futuna", "EH": "Western Sahara", "YE": "Yemen", "ZM": "Zambia", "ZW": "Zimbabwe"
};

// Common city-to-country validation map
const CITY_COUNTRY_MAP = {
  "london": ["united kingdom", "uk"],
  "manchester": ["united kingdom", "uk"],
  "birmingham": ["united kingdom", "uk"],
  "leeds": ["united kingdom", "uk"],
  "glasgow": ["united kingdom", "uk"],
  "liverpool": ["united kingdom", "uk"],
  "edinburgh": ["united kingdom", "uk"],
  "bristol": ["united kingdom", "uk"],
  
  "new york": ["united states", "usa", "us"],
  "los angeles": ["united states", "usa", "us"],
  "chicago": ["united states", "usa", "us"],
  "houston": ["united states", "usa", "us"],
  "phoenix": ["united states", "usa", "us"],
  "philadelphia": ["united states", "usa", "us"],
  "san antonio": ["united states", "usa", "us"],
  "san diego": ["united states", "usa", "us"],
  "dallas": ["united states", "usa", "us"],
  "san jose": ["united states", "usa", "us"],
  "austin": ["united states", "usa", "us"],
  "jacksonville": ["united states", "usa", "us"],
  "san francisco": ["united states", "usa", "us"],
  "columbus": ["united states", "usa", "us"],
  "fort worth": ["united states", "usa", "us"],
  "indianapolis": ["united states", "usa", "us"],
  "charlotte": ["united states", "usa", "us"],
  "seattle": ["united states", "usa", "us"],
  "denver": ["united states", "usa", "us"],
  "boston": ["united states", "usa", "us"],
  "el paso": ["united states", "usa", "us"],
  "detroit": ["united states", "usa", "us"],
  "nashville": ["united states", "usa", "us"],
  "memphis": ["united states", "usa", "us"],
  "portland": ["united states", "usa", "us"],
  "oklahoma city": ["united states", "usa", "us"],
  "las vegas": ["united states", "usa", "us"],
  "baltimore": ["united states", "usa", "us"],
  
  "toronto": ["canada", "ca"],
  "montreal": ["canada", "ca"],
  "vancouver": ["canada", "ca"],
  "calgary": ["canada", "ca"],
  "ottawa": ["canada", "ca"],
  "edmonton": ["canada", "ca"],
  
  "sydney": ["australia", "au"],
  "melbourne": ["australia", "au"],
  "brisbane": ["australia", "au"],
  "perth": ["australia", "au"],
  "adelaide": ["australia", "au"],
  "canberra": ["australia", "au"],
  
  "paris": ["france", "fr"],
  "marseille": ["france", "fr"],
  "lyon": ["france", "fr"],
  
  "berlin": ["germany", "de"],
  "munich": ["germany", "de"],
  "frankfurt": ["germany", "de"],
  "hamburg": ["germany", "de"],
  
  "rome": ["italy", "it"],
  "milan": ["italy", "it"],
  "florence": ["italy", "it"],
  "venice": ["italy", "it"],
  
  "madrid": ["spain", "es"],
  "barcelona": ["spain", "es"],
  
  "amsterdam": ["netherlands", "nl"],
  "rotterdam": ["netherlands", "nl"],
  
  "mumbai": ["india", "in"],
  "delhi": ["india", "in"],
  "bangalore": ["india", "in"],
  "hyderabad": ["india", "in"],
  "chennai": ["india", "in"],
  "kolkata": ["india", "in"],
  "pune": ["india", "in"],
  "ahmedabad": ["india", "in"],

  "tokyo": ["japan", "jp"],
  "osaka": ["japan", "jp"],
  "kyoto": ["japan", "jp"],

  "auckland": ["new zealand", "nz"],
  "wellington": ["new zealand", "nz"],
  "christchurch": ["new zealand", "nz"],

  "dublin": ["ireland", "ie"],
  "cork": ["ireland", "ie"],
  
  "singapore": ["singapore", "sg"],
  "hong kong": ["china", "hong kong", "hk", "cn"],
  "beijing": ["china", "cn"],
  "shanghai": ["china", "cn"],

  "cape town": ["south africa", "za"],
  "johannesburg": ["south africa", "za"],
  
  "rio de janeiro": ["brazil", "br"],
  "sao paulo": ["brazil", "br"],
  "buenos aires": ["argentina", "ar"],
  "mexico city": ["mexico", "mx"]
};

// App state
let activeResults = [];
let eventSource = null;
let uniqueEmails = new Set();
let uniqueWebsites = new Set();
let duplicatesCount = 0;
let sitesCount = 0;
let emailsCount = 0;
let logs = [];

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const sidebarTabs = document.querySelectorAll('.sidebar-tabs .tab-btn');
const keywordForm = document.getElementById('keywordForm');
const urlForm = document.getElementById('urlForm');
const historyList = document.getElementById('historyList');
const btnClearHistory = document.getElementById('btnClearHistory');
const btnClearLogs = document.getElementById('btnClearLogs');
const tableFilter = document.getElementById('tableFilter');

// Selection UI Elements
const selectAllLeads = document.getElementById('selectAllLeads');
const selectionLabel = document.getElementById('selectionLabel');

// Metrics elements
const statSites = document.getElementById('statSites');
const statEmails = document.getElementById('statEmails');
const statDuplicates = document.getElementById('statDuplicates');

// Progress Panel elements
const progressCard = document.getElementById('progressCard');
const progressBar = document.getElementById('progressBar');
const progressTitle = document.getElementById('progressTitle');
const progressPercent = document.getElementById('progressPercent');
const progressSpinner = document.getElementById('progressSpinner');
const variationsGrid = document.getElementById('variationsGrid');
const variationsSection = document.getElementById('variationsSection');
const consoleOutput = document.getElementById('consoleOutput');

// Table elements
const leadsTableBody = document.getElementById('leadsTableBody');
const resultsCount = document.getElementById('resultsCount');

// Bulk Action Buttons
const btnCopyEmails = document.getElementById('btnCopyEmails');
const btnCopyWebsites = document.getElementById('btnCopyWebsites');
const btnCopyAll = document.getElementById('btnCopyAll');
const btnExportCSV = document.getElementById('btnExportCSV');
const btnExportExcel = document.getElementById('btnExportExcel');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    populateCountriesDropdown();
    initTheme();
    loadHistory();
    setupEventListeners();
});

// Dynamic country select builder
function populateCountriesDropdown() {
    const countrySelect = document.getElementById('country');
    if (!countrySelect) return;
    
    countrySelect.innerHTML = '';
    const defaultCountry = 'United States';
    
    Object.entries(ISO_COUNTRIES).forEach(([code, name]) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = `${name} (${code})`;
        if (name === defaultCountry) {
            option.selected = true;
        }
        countrySelect.appendChild(option);
    });
}

// Setup Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, 'success');
});

// Sidebar Tab switching
sidebarTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        sidebarTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const targetFormId = tab.getAttribute('data-target') === 'keyword-search-tab' ? 'keywordForm' : 'urlForm';
        
        if (targetFormId === 'keywordForm') {
            keywordForm.classList.add('active-form');
            urlForm.classList.remove('active-form');
        } else {
            urlForm.classList.add('active-form');
            keywordForm.classList.remove('active-form');
        }
    });
});

// Setup Event Listeners
function setupEventListeners() {
    // Keyword Search Form Submit
    keywordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        startKeywordSearch();
    });

    // URL Crawler Form Submit
    urlForm.addEventListener('submit', (e) => {
        e.preventDefault();
        startUrlCrawl();
    });

    // File Upload Handler (CSV / TXT)
    const urlFileInput = document.getElementById('urlFile');
    if (urlFileInput) {
        urlFileInput.addEventListener('change', handleUrlFileUpload);
    }

    // Clean Log Console
    btnClearLogs.addEventListener('click', () => {
        consoleOutput.innerHTML = '<span class="console-placeholder">Console log cleared.</span>';
        logs = [];
    });

    // Clear history
    btnClearHistory.addEventListener('click', clearHistory);

    // Table Filter (live keystrokes)
    tableFilter.addEventListener('input', filterAndRenderTable);

    // Filter checkbox changes
    document.getElementById('filterHighQuality').addEventListener('change', filterAndRenderTable);
    document.getElementById('filterCorporate').addEventListener('change', filterAndRenderTable);
    document.getElementById('filterExcludeFree').addEventListener('change', filterAndRenderTable);
    document.getElementById('filterExcludeSocial').addEventListener('change', filterAndRenderTable);
    document.getElementById('filterExcludeMarketplace').addEventListener('change', filterAndRenderTable);

    // Sort dropdown change
    document.getElementById('tableSortBy').addEventListener('change', filterAndRenderTable);

    // Bulk actions
    btnCopyEmails.addEventListener('click', copyEmailsToClipboard);
    btnCopyWebsites.addEventListener('click', copyWebsitesToClipboard);
    btnCopyAll.addEventListener('click', copyAllDataToClipboard);
    btnExportCSV.addEventListener('click', exportToCSV);
    btnExportExcel.addEventListener('click', exportToExcel);

    // Row selector checkbox select-all trigger
    selectAllLeads.addEventListener('change', () => {
        const checked = selectAllLeads.checked;
        const rows = leadsTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const cb = row.querySelector('.lead-checkbox');
            if (cb) {
                cb.checked = checked;
                if (checked) {
                    row.classList.add('row-selected');
                } else {
                    row.classList.remove('row-selected');
                }
            }
        });
        updateSelectionState();
    });
}

// Read and parse TXT/CSV files for URL extraction
function handleUrlFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        let urls = [];
        
        if (file.name.endsWith('.csv')) {
            const lines = text.split('\n');
            lines.forEach(line => {
                const cols = line.split(',');
                cols.forEach(col => {
                    const val = col.trim().replace(/^["']|["']$/g, '');
                    if (val && (val.includes('.') || val.startsWith('http'))) {
                        urls.push(val);
                    }
                });
            });
        } else {
            const lines = text.split('\n');
            lines.forEach(line => {
                const val = line.trim();
                if (val) urls.push(val);
            });
        }

        const validUrls = Array.from(new Set(urls))
            .filter(u => u.length > 3 && !u.startsWith('#') && !u.startsWith('//'));

        if (validUrls.length > 0) {
            document.getElementById('urls').value = validUrls.join('\n');
            showToast(`Extracted ${validUrls.length} URL(s) from uploaded file!`, 'success');
        } else {
            showToast('No valid URLs detected inside uploaded file.', 'error');
        }
    };
    reader.readAsText(file);
}

// Show toast notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer; margin-left: 10px;" onclick="this.parentElement.remove()"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Helper: Format Console Messages
function addConsoleLine(text) {
    if (consoleOutput.querySelector('.console-placeholder')) {
        consoleOutput.innerHTML = '';
    }
    
    const line = document.createElement('div');
    line.className = 'console-line';
    
    if (text.startsWith('[SEARCH]') || text.startsWith('[DISCOVER]')) {
        line.classList.add('discover');
    } else if (text.startsWith('[CRAWL]') || text.startsWith('[QUEUE]')) {
        line.classList.add('crawl');
    } else if (text.startsWith('[EMAIL]')) {
        line.classList.add('email');
    } else if (text.startsWith('[ERROR]')) {
        line.classList.add('error');
    } else if (text.startsWith('[WARN]') || text.startsWith('[INFO]')) {
        line.classList.add('info');
    }
    
    line.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Reset UI state before starting search/crawl
function resetSearchState() {
    activeResults = [];
    uniqueEmails.clear();
    uniqueWebsites.clear();
    duplicatesCount = 0;
    sitesCount = 0;
    emailsCount = 0;
    
    // Update stats UI
    statSites.textContent = '0';
    statEmails.textContent = '0';
    statDuplicates.textContent = '0';
    resultsCount.textContent = '0 Results';
    selectAllLeads.checked = false;
    selectionLabel.style.display = 'none';
    
    // Reset table
    leadsTableBody.innerHTML = `
        <tr class="empty-row">
            <td colspan="11">
                <div class="table-empty-state">
                    <span class="spinner"></span>
                    <h4 style="margin-top: 15px;">FindEmailsPro Engine initializing...</h4>
                    <p>Contacting search engines, generating query pools, and preparing parallel crawling queue...</p>
                </div>
            </td>
        </tr>
    `;

    // Reset progress card
    progressCard.style.display = 'block';
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    progressSpinner.style.display = 'inline-block';
    
    variationsGrid.innerHTML = '';
    consoleOutput.innerHTML = '';

    // Reset Debug Panel
    const debugCard = document.getElementById('debugCard');
    if (debugCard) {
        debugCard.style.display = 'none';
        document.getElementById('debugQueries').textContent = 'N/A';
        document.getElementById('debugProvider').textContent = 'N/A';
        document.getElementById('debugWebsitesFound').textContent = '0';
        document.getElementById('debugDomainsFiltered').textContent = '0';
        document.getElementById('debugEmailsExtracted').textContent = '0';
    }
    
    if (eventSource) {
        eventSource.close();
    }
}

// Selection tracker status updates
function updateSelectionState() {
    const checkboxes = leadsTableBody.querySelectorAll('.lead-checkbox');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (checkedCount > 0) {
        selectionLabel.style.display = 'inline-block';
        selectionLabel.textContent = `${checkedCount} selected`;
    } else {
        selectionLabel.style.display = 'none';
    }
    
    if (checkboxes.length > 0 && checkedCount === checkboxes.length) {
        selectAllLeads.checked = true;
    } else {
        selectAllLeads.checked = false;
    }
}

// Context resolver for bulk operations (selection-aware)
function getActiveLeadsContext() {
    const checkboxes = leadsTableBody.querySelectorAll('.lead-checkbox');
    const selectedIndexes = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.getAttribute('data-index')));
        
    const list = getFilteredAndSortedList();
    if (selectedIndexes.length > 0) {
        return selectedIndexes.map(idx => list[idx]);
    }
    return list;
}

// Start Keyword Discovery Search (SSE)
function startKeywordSearch() {
    const keyword = document.getElementById('keyword').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;
    const maxResults = document.getElementById('maxResults').value;

    // City-country validation
    if (city) {
        const cleanCity = city.trim().toLowerCase();
        const cleanCountry = country.trim().toLowerCase();
        if (CITY_COUNTRY_MAP[cleanCity]) {
            const allowed = CITY_COUNTRY_MAP[cleanCity];
            const match = allowed.some(c => cleanCountry.includes(c) || c.includes(cleanCountry));
            if (!match) {
                showToast("Selected city may not belong to selected country.", "error");
                return;
            }
        }
    }

    resetSearchState();
    progressTitle.textContent = `Finding leads for: "${keyword}" in ${city || country}`;
    variationsSection.style.display = 'block';

    const urlParams = new URLSearchParams({
        keyword,
        country,
        city,
        maxResults
    });

    eventSource = new EventSource(`/api/search?${urlParams.toString()}`);

    let totalRequested = parseInt(maxResults);

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'start') {
            addConsoleLine('[START] Connected to FindEmailsPro Multi-Source Scraper.');
            addConsoleLine(`[INFO] Targeting up to ${totalRequested} leads.`);
            
            // Render variations
            data.queries.forEach(query => {
                const tag = document.createElement('span');
                tag.className = 'variation-tag';
                tag.textContent = query;
                variationsGrid.appendChild(tag);
            });
            if (variationsGrid.children.length > 0) {
                variationsGrid.children[0].classList.add('active');
            }
            
        } else if (data.type === 'debug') {
            // Update Search Debug Panel
            const debugCard = document.getElementById('debugCard');
            if (debugCard && data.debug) {
                debugCard.style.display = 'block';
                document.getElementById('debugQueries').textContent = data.debug.generatedQueries.join(' | ');
                document.getElementById('debugProvider').textContent = data.debug.providerUsed;
                document.getElementById('debugWebsitesFound').textContent = data.debug.websitesFound;
                document.getElementById('debugDomainsFiltered').textContent = data.debug.domainsFiltered;
                document.getElementById('debugEmailsExtracted').textContent = data.debug.emailsExtracted;
            }

        } else if (data.type === 'log') {
            addConsoleLine(data.message);
            
            if (data.message.startsWith('[SEARCH]')) {
                const currentTags = variationsGrid.children;
                if (currentTags.length > 0) {
                    const activeIndex = Math.floor(Math.random() * currentTags.length);
                    for (let i = 0; i < currentTags.length; i++) {
                        currentTags[i].classList.remove('active');
                    }
                    currentTags[activeIndex].classList.add('active');
                }
            }
            
        } else if (data.type === 'progress') {
            const pct = Math.min(Math.round((data.current / data.total) * 100), 99);
            progressBar.style.width = `${pct}%`;
            progressPercent.textContent = `${pct}%`;

        } else if (data.type === 'result') {
            const lead = data.lead;
            processDiscoveredLead(lead);

        } else if (data.type === 'complete') {
            progressBar.style.width = '100%';
            progressPercent.textContent = '100%';
            progressSpinner.style.display = 'none';
            progressTitle.textContent = 'Discovery Scan Complete';
            
            addConsoleLine(`[FINISH] Completed search request. Workspace contains ${activeResults.length} leads.`);
            showToast(`Search completed. Discovered ${activeResults.length} unique company records!`, 'success');
            
            eventSource.close();
            loadHistory();
        }
    };

    eventSource.onerror = (err) => {
        console.error('SSE Error:', err);
        addConsoleLine('[ERROR] Server connection interrupted or closed.');
        progressSpinner.style.display = 'none';
        progressTitle.textContent = 'Discovery Interrupted';
        showToast('Engine search stream interrupted.', 'error');
        eventSource.close();
    };
}

// Start Real-Time URL Crawling (SSE)
function startUrlCrawl() {
    const urlsText = document.getElementById('urls').value;
    const urlList = urlsText.split('\n').map(u => u.trim()).filter(u => u.length > 0);

    if (urlList.length === 0) {
        showToast('Please insert at least one valid URL to crawl.', 'error');
        return;
    }

    resetSearchState();
    progressTitle.textContent = `Real-Time Crawl: ${urlList.length} site(s) queued`;
    variationsSection.style.display = 'none';

    const urlParams = new URLSearchParams({
        urls: urlList.join(',')
    });

    eventSource = new EventSource(`/api/crawl-urls?${urlParams.toString()}`);

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'start') {
            addConsoleLine(`[START] Initializing target queue crawl of ${data.totalUrls} websites.`);
        } else if (data.type === 'log') {
            addConsoleLine(data.message);
        } else if (data.type === 'progress') {
            const pct = Math.round((data.current / data.total) * 100);
            progressBar.style.width = `${pct}%`;
            progressPercent.textContent = `${pct}%`;
        } else if (data.type === 'result') {
            const lead = data.lead;
            processDiscoveredLead(lead);
        } else if (data.type === 'complete') {
            progressBar.style.width = '100%';
            progressPercent.textContent = '100%';
            progressSpinner.style.display = 'none';
            progressTitle.textContent = 'Queue Crawl Complete';
            
            addConsoleLine(`[FINISH] Completed all tasks in target queue.`);
            showToast(`Crawl finished. Found ${activeResults.length} company records.`, 'success');
            eventSource.close();
        }
    };

    eventSource.onerror = (err) => {
        console.error('SSE Error:', err);
        addConsoleLine('[ERROR] URL crawl stream failed.');
        progressSpinner.style.display = 'none';
        progressTitle.textContent = 'Crawl Interrupted';
        showToast('Crawl engine stream encountered an error.', 'error');
        eventSource.close();
    };
}

// Process single lead & merge emails by domain (Advanced Deduplication)
function processDiscoveredLead(lead) {
    const cleanDomain = lead.website.replace(/^https?:\/\/(www\.)?/i, '').split('/')[0].toLowerCase();
    
    // Check if domain is already present in workspace
    const existingIndex = activeResults.findIndex(r => {
        const d = r.website.replace(/^https?:\/\/(www\.)?/i, '').split('/')[0].toLowerCase();
        return d === cleanDomain;
    });

    if (existingIndex !== -1) {
        const existingLead = activeResults[existingIndex];
        let mergedNewEmails = false;
        
        lead.emails.forEach(newEmailObj => {
            const emailExists = existingLead.emails.some(e => e.email === newEmailObj.email);
            if (!emailExists) {
                existingLead.emails.push(newEmailObj);
                mergedNewEmails = true;
                
                emailsCount++;
                statEmails.textContent = emailsCount;
                addConsoleLine(`[EMAIL] Added new address to ${existingLead.businessName}: ${newEmailObj.email}`);
            } else {
                duplicatesCount++;
                statDuplicates.textContent = duplicatesCount;
            }
        });
        
        if (mergedNewEmails) {
            existingLead.leadScore = Math.max(existingLead.leadScore, lead.leadScore);
            filterAndRenderTable();
        }
        return;
    }

    // New website discovery
    if (!uniqueWebsites.has(cleanDomain)) {
        uniqueWebsites.add(cleanDomain);
        sitesCount++;
        statSites.textContent = sitesCount;
    }

    // Update emails counts
    lead.emails.forEach(e => {
        emailsCount++;
    });
    statEmails.textContent = emailsCount;

    activeResults.push(lead);
    filterAndRenderTable();
}

// Core helper: Filter and sort active results array
function getFilteredAndSortedList() {
    let list = [...activeResults];

    const filterHighQual = document.getElementById('filterHighQuality').checked;
    const filterCorp = document.getElementById('filterCorporate').checked;
    const excludeFree = document.getElementById('filterExcludeFree').checked;
    const excludeSocial = document.getElementById('filterExcludeSocial').checked;
    const excludeMarketplace = document.getElementById('filterExcludeMarketplace').checked;
    const textQuery = tableFilter.value.toLowerCase().trim();

    list = list.filter(lead => {
        // Exclude Social Platforms
        if (excludeSocial) {
            const domain = lead.website.toLowerCase();
            const socials = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'pinterest.com', 'tiktok.com', 'snapchat.com', 'reddit.com', 'tumblr.com'];
            if (socials.some(s => domain.includes(s))) return false;
        }

        // Exclude Marketplaces
        if (excludeMarketplace) {
            const domain = lead.website.toLowerCase();
            const marketplaces = ['amazon.com', 'amazon.co.uk', 'ebay.com', 'ebay.co.uk', 'etsy.com', 'shopify.com', 'aliexpress.com'];
            if (marketplaces.some(m => domain.includes(m))) return false;
        }

        // High Quality Score (>= 70)
        if (filterHighQual && lead.leadScore < 70) {
            return false;
        }

        // Apply Email Level Filters
        let emails = [...lead.emails];

        if (filterCorp) {
            emails = emails.filter(e => {
                const user = e.email.split('@')[0];
                const domain = e.email.split('@')[1];
                const lowPrefixes = ['support', 'service', 'marketing', 'media', 'press', 'help', 'billing', 'accounts', 'feedback'];
                const lowDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'aol.com', 'mail.com', 'icloud.com', 'zoho.com', 'yandex.com', 'protonmail.com', 'live.com', 'msn.com'];
                
                return !lowPrefixes.includes(user) && !lowDomains.includes(domain);
            });
        }

        if (excludeFree) {
            emails = emails.filter(e => {
                const domain = e.email.split('@')[1];
                const lowDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'aol.com', 'mail.com', 'icloud.com', 'zoho.com', 'yandex.com', 'protonmail.com', 'live.com', 'msn.com'];
                return !lowDomains.includes(domain);
            });
        }

        // Drop company if filter results in zero emails
        if ((filterCorp || excludeFree) && emails.length === 0) {
            return false;
        }

        lead.displayEmails = emails;

        // Apply Text Query Filter
        if (textQuery) {
            const searchableStr = `${lead.businessName} ${lead.website} ${lead.title || ''} ${lead.description || ''} ${emails.map(e => e.email).join(' ')}`.toLowerCase();
            if (!searchableStr.includes(textQuery)) {
                return false;
            }
        }

        return true;
    });

    // Apply Sorting
    const sortBy = document.getElementById('tableSortBy').value;
    if (sortBy === 'score-desc') {
        list.sort((a, b) => b.leadScore - a.leadScore);
    } else if (sortBy === 'score-asc') {
        list.sort((a, b) => a.leadScore - b.leadScore);
    } else if (sortBy === 'emails-desc') {
        list.sort((a, b) => (b.displayEmails || b.emails).length - (a.displayEmails || a.emails).length);
    } else if (sortBy === 'website-asc') {
        list.sort((a, b) => a.website.localeCompare(b.website));
    } else if (sortBy === 'name-asc') {
        list.sort((a, b) => a.businessName.localeCompare(b.businessName));
    }

    return list;
}

// Filter and render list to workspace table
function filterAndRenderTable() {
    const list = getFilteredAndSortedList();
    leadsTableBody.innerHTML = '';

    if (list.length === 0) {
        if (activeResults.length === 0) {
            leadsTableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="11">
                        <div class="table-empty-state">
                            <div class="empty-icon" style="color: var(--warning); margin-bottom: 12px; display: flex; justify-content: center;">
                                <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            </div>
                            <h4>No business websites found or crawled</h4>
                            <p style="margin-top: 8px; font-weight: 600; color: var(--text-primary);">Suggestions:</p>
                            <ul style="list-style: none; padding: 0; margin: 8px auto; font-size: 13px; color: var(--text-secondary); max-width: 250px; text-align: left; line-height: 1.8;">
                                <li>💡 Try a broader keyword</li>
                                <li>💡 Remove the city filter</li>
                                <li>💡 Change the targeted country</li>
                            </ul>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            leadsTableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="11">
                        <div class="table-empty-state">
                            <h4>No leads match current filter criteria</h4>
                            <p>Adjust your filter toggles or search keyword.</p>
                        </div>
                    </td>
                </tr>
            `;
        }
        resultsCount.textContent = '0 Results';
        return;
    }

    list.forEach((lead, index) => {
        renderLeadsRow(lead, index);
    });

    resultsCount.textContent = `${list.length} Results`;
}

// Render row inside results table workspace
function renderLeadsRow(lead, index) {
    const row = document.createElement('tr');
    row.setAttribute('data-index', index);

    let statusClass = 'badge-primary';
    if (lead.status === 'Success') statusClass = 'badge-success';
    if (lead.status === 'No Emails Found') statusClass = 'badge-warning';
    if (lead.status === 'Crawl Error' || lead.status === 'Invalid URL' || lead.status.startsWith('HTTP')) statusClass = 'badge-danger';

    const webLink = lead.website.startsWith('www.') ? `http://${lead.website.substring(4)}` : lead.website;
    const cleanWebText = lead.website.replace(/^https?:\/\/(www\.)?/i, '').split('/')[0];

    const emailsList = lead.displayEmails || lead.emails;

    // Build quality badge emails grid
    let emailsHtml = '';
    if (emailsList && emailsList.length > 0) {
        emailsHtml = `<div class="emails-list-container">`;
        emailsList.forEach(item => {
            let badgeClass = 'quality-high';
            if (item.quality === 'Medium') badgeClass = 'quality-medium';
            if (item.quality === 'Low') badgeClass = 'quality-low';
            
            emailsHtml += `
                <div class="email-row-item">
                    <a href="mailto:${item.email}" class="email-link">${item.email}</a>
                    <div style="display: flex; gap: 4px; align-items: center;">
                        <span class="quality-badge ${badgeClass}">${item.quality}</span>
                        <span class="source-badge">${item.sourceType || 'Generic'}</span>
                    </div>
                </div>
            `;
        });
        emailsHtml += `</div>`;
    } else {
        emailsHtml = `<span style="color: var(--text-muted);">N/A</span>`;
    }

    // Lead Score badge color classification
    let scoreClass = 'badge-success';
    if (lead.leadScore < 50) scoreClass = 'badge-danger';
    else if (lead.leadScore < 70) scoreClass = 'badge-warning';

    // Source count calculation
    const sourcePages = new Set(lead.emails.map(e => e.sourcePage));
    const sourceCount = sourcePages.size || (lead.emails.length > 0 ? 1 : 0);

    row.innerHTML = `
        <td style="text-align: center;">
            <input type="checkbox" class="lead-checkbox" data-index="${index}">
        </td>
        <td><b>${lead.businessName}</b></td>
        <td><span class="badge badge-accent" style="white-space: nowrap;">${lead.category || 'Unknown'}</span></td>
        <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${lead.title || ''}">${lead.title || '<span style="color: var(--text-muted);">N/A</span>'}</td>
        <td><a href="${webLink}" target="_blank" class="website-link">${cleanWebText}</a></td>
        <td>${emailsHtml}</td>
        <td><span class="badge ${scoreClass}" style="font-weight: 700;">${lead.leadScore}/100</span></td>
        <td style="text-align: center;"><b>${lead.emails.length}</b></td>
        <td style="text-align: center;"><b>${sourceCount}</b></td>
        <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--text-muted);" title="${lead.description || ''}">${lead.description || 'N/A'}</td>
        <td><span class="badge ${statusClass}">${lead.status}</span></td>
    `;

    // Row selection check box change handler
    const checkbox = row.querySelector('.lead-checkbox');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            row.classList.add('row-selected');
        } else {
            row.classList.remove('row-selected');
        }
        updateSelectionState();
    });

    leadsTableBody.appendChild(row);
}

// Copy actions (Selection aware)
function copyEmailsToClipboard() {
    const targets = getActiveLeadsContext();
    const emailsList = [];
    
    targets.forEach(r => {
        const list = r.displayEmails || r.emails;
        if (list && list.length > 0) {
            list.forEach(e => emailsList.push(e.email));
        }
    });

    const uniqueEmailsList = Array.from(new Set(emailsList)).join('\n');

    if (!uniqueEmailsList) {
        showToast('No email addresses available to copy.', 'error');
        return;
    }

    navigator.clipboard.writeText(uniqueEmailsList)
        .then(() => showToast(`Copied ${Array.from(new Set(emailsList)).length} unique email address(es) to clipboard!`, 'success'))
        .catch(() => showToast('Failed to copy to clipboard.', 'error'));
}

function copyWebsitesToClipboard() {
    const targets = getActiveLeadsContext();
    const websites = targets.map(r => r.website).filter(w => w !== '').join('\n');

    if (!websites) {
        showToast('No websites available to copy.', 'error');
        return;
    }

    navigator.clipboard.writeText(websites)
        .then(() => showToast(`Copied ${targets.length} website URL(s) to clipboard!`, 'success'))
        .catch(() => showToast('Failed to copy.', 'error'));
}

function copyAllDataToClipboard() {
    const targets = getActiveLeadsContext();
    if (targets.length === 0) {
        showToast('No data available to copy.', 'error');
        return;
    }

    let text = 'Business Name\tCategory\tTitle\tWebsite\tEmails (Quality & Source)\tLead Score\tEmail Count\tSource Count\tDescription\tStatus\n';
    targets.forEach(r => {
        const emailsStr = r.emails.map(e => `${e.email} (${e.quality} - ${e.sourceType || 'Generic'})`).join(', ') || 'N/A';
        const sourcePages = new Set(r.emails.map(e => e.sourcePage));
        const sourceCount = sourcePages.size || (r.emails.length > 0 ? 1 : 0);
        
        text += `${r.businessName}\t${r.category || 'Unknown'}\t${r.title || 'N/A'}\t${r.website}\t${emailsStr}\t${r.leadScore}\t${r.emails.length}\t${sourceCount}\t${r.description || 'N/A'}\t${r.status}\n`;
    });

    navigator.clipboard.writeText(text)
        .then(() => showToast('Copied workspace content to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy workspace.', 'error'));
}

// CSV Export (Selection aware with UTF-8 BOM)
function exportToCSV() {
    const targets = getActiveLeadsContext();
    if (targets.length === 0) {
        showToast('No records to export.', 'error');
        return;
    }

    const csvHeaders = ['Business Name', 'Category', 'Website Title', 'Website', 'Emails', 'Lead Score', 'Email Count', 'Source Count', 'Meta Description', 'Status'];
    const csvRows = [csvHeaders.join(',')];

    targets.forEach(r => {
        const emailsStr = r.emails.map(e => `${e.email} (${e.quality} - ${e.sourceType || 'Generic'})`).join('; ') || 'N/A';
        const sourcePages = new Set(r.emails.map(e => e.sourcePage));
        const sourceCount = sourcePages.size || (r.emails.length > 0 ? 1 : 0);
        
        const row = [
            `"${(r.businessName || '').replace(/"/g, '""')}"`,
            `"${(r.category || 'Unknown').replace(/"/g, '""')}"`,
            `"${(r.title || '').replace(/"/g, '""')}"`,
            `"${(r.website || '').replace(/"/g, '""')}"`,
            `"${emailsStr.replace(/"/g, '""')}"`,
            `"${r.leadScore}"`,
            `"${r.emails.length}"`,
            `"${sourceCount}"`,
            `"${(r.description || '').replace(/"/g, '""')}"`,
            `"${(r.status || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
    });

    const csvContent = "\ufeff" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const encodedUri = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    const dateStr = new Date().toISOString().slice(0, 10);
    const keywordVal = document.getElementById('keyword').value || 'leads';
    link.setAttribute("download", `FindEmailsPro_${keywordVal}_${dateStr}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Exported CSV file successfully!', 'success');
}

// Excel Export (Selection aware)
function exportToExcel() {
    const targets = getActiveLeadsContext();
    if (targets.length === 0) {
        showToast('No records to export.', 'error');
        return;
    }

    const headers = ['Business Name', 'Category', 'Website Title', 'Website', 'Emails', 'Lead Score', 'Email Count', 'Source Count', 'Meta Description', 'Status'];
    const rows = [headers.join('\t')];

    targets.forEach(r => {
        const emailsStr = r.emails.map(e => `${e.email} (${e.quality} - ${e.sourceType || 'Generic'})`).join(', ') || 'N/A';
        const sourcePages = new Set(r.emails.map(e => e.sourcePage));
        const sourceCount = sourcePages.size || (r.emails.length > 0 ? 1 : 0);
        
        const row = [
            r.businessName,
            r.category || 'Unknown',
            r.title || '',
            r.website,
            emailsStr,
            r.leadScore,
            r.emails.length,
            sourceCount,
            r.description || '',
            r.status
        ];
        rows.push(row.join('\t'));
    });

    const excelContent = "\ufeff" + rows.join('\n');
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const encodedUri = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    const dateStr = new Date().toISOString().slice(0, 10);
    const keywordVal = document.getElementById('keyword').value || 'leads';
    link.setAttribute("download", `FindEmailsPro_${keywordVal}_${dateStr}.xls`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Exported Excel file successfully!', 'success');
}

// Load Recent Search History
async function loadHistory() {
    try {
        const response = await fetch('/api/history');
        const history = await response.json();
        
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<li class="empty-state">No search history yet.</li>';
            return;
        }

        history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const date = new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });

            li.innerHTML = `
                <div class="history-item-header">
                    <span>${item.keyword}</span>
                    <span class="badge badge-primary">${item.resultCount || 0} leads</span>
                </div>
                <div class="history-item-meta">
                    <span>${item.city ? item.city + ', ' : ''}${item.country}</span>
                    <span>${date} ${time}</span>
                </div>
            `;

            // Reload search form details on click
            li.addEventListener('click', () => {
                const kwTab = Array.from(sidebarTabs).find(t => t.getAttribute('data-target') === 'keyword-search-tab');
                if (kwTab) kwTab.click();

                document.getElementById('keyword').value = item.keyword;
                document.getElementById('country').value = item.country;
                document.getElementById('city').value = item.city === 'All Cities' ? '' : item.city;
                document.getElementById('maxResults').value = item.maxResults;
                
                startKeywordSearch();
                showToast(`Reloaded search: "${item.keyword}"`, 'success');
            });

            historyList.appendChild(li);
        });

    } catch (err) {
        console.error('Failed to load history:', err);
    }
}

// Clear Search History
async function clearHistory() {
    if (confirm('Are you sure you want to clear your discovery history?')) {
        try {
            const response = await fetch('/api/history/clear', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                showToast('Search history cleared.', 'success');
                loadHistory();
            }
        } catch (err) {}
    }
}
