// Main Application State Logic Engine
let selectedCategories = [];
let proxyDataStore = {};

// Handle splash fade sequence, dashboard delivery, and text rotation logic
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const mainContent = document.getElementById('main-content');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none'; 
            mainContent.style.display = 'block';
            setTimeout(() => { 
                mainContent.style.opacity = '1'; 
                showToast("Welcome to Steezy's Proxy Vault"); 
                
                // Initialize the random banner loop once the dashboard reveals
                initBannerRotation();
            }, 50);
        }, 500);
    }, 1800);
    initApp();
});

// Announcement Banner Randomizer Loop Engine
function initBannerRotation() {
    const banner = document.getElementById('random-banner');
    if (!banner || !CONFIG.announcements || CONFIG.announcements.length === 0) return;

    // Pick and display an initial random quote instantly
    let lastIndex = Math.floor(Math.random() * CONFIG.announcements.length);
    banner.textContent = CONFIG.announcements[lastIndex];

    // Cycle through a new quote every 8 seconds
    setInterval(() => {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-2px)';

        setTimeout(() => {
            let nextIndex;
            // Prevent picking the exact same text twice in a row if there are options
            do {
                nextIndex = Math.floor(Math.random() * CONFIG.announcements.length);
            } while (nextIndex === lastIndex && CONFIG.announcements.length > 1);
            
            lastIndex = nextIndex;
            banner.textContent = CONFIG.announcements[lastIndex];
            banner.style.opacity = '1';
            banner.style.transform = 'translateY(0)';
        }, 300); // Wait for the fade-out animation before swapping text
    }, 8000);
}

// Toast notification dispatch mechanism
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div'); 
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-icon"></div><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => { 
        toast.classList.remove('show'); 
        setTimeout(() => toast.remove(), 400); 
    }, 3000);
}

// Data synchronization handshake with local proxy text assets
async function initApp() {
    let grandTotal = 0;
    for (let cat of CONFIG.categories) {
        try {
            const response = await fetch(`categories/${cat}.txt`);
            if (response.ok) {
                const rawText = await response.text();
                proxyDataStore[cat] = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            } else { proxyDataStore[cat] = []; }
        } catch (e) { proxyDataStore[cat] = []; }
        grandTotal += (proxyDataStore[cat] || []).length;
    }
    document.getElementById('global-total-counter').textContent = `Total Proxies Mapped: ${grandTotal} (Click for breakdown)`;
    buildFilterInterface();
    renderProxies();
    buildMetricsGrid();
}

// Initialize popup checkbox UI items based on config properties
function buildFilterInterface() {
    const grid = document.getElementById('filter-checkbox-target'); 
    grid.innerHTML = '';
    CONFIG.categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'filter-checkbox-card'; 
        div.id = `filter-card-${cat}`;
        div.innerHTML = `<div class="box-indicator"></div><span>${cat}</span>`;
        div.onclick = () => toggleFilterSelection(cat);
        grid.appendChild(div);
    });
}

// Process user tag filter modifications
function toggleFilterSelection(cat) {
    const card = document.getElementById(`filter-card-${cat}`);
    if (selectedCategories.includes(cat)) {
        selectedCategories = selectedCategories.filter(c => c !== cat); 
        card.classList.remove('selected');
    } else {
        selectedCategories.push(cat); 
        card.classList.add('selected');
    }
    renderProxies();
}

// Reset filtering parameters instantly
function resetFiltersAction() {
    selectedCategories = [];
    CONFIG.categories.forEach(cat => {
        const card = document.getElementById(`filter-card-${cat}`);
        if (card) card.classList.remove('selected');
    });
    renderProxies();
    showToast("Filter parameters reset to global");
}

// Handle layout navigation within filter tabs
function switchFilterTab(tabType) {
    document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.filter-view-pane').forEach(p => p.classList.remove('active'));
    if (tabType === 'cat') {
        document.getElementById('btn-tab-cat').classList.add('active');
        document.getElementById('pane-filter-cat').classList.add('active');
    } else {
        document.getElementById('btn-tab-block').classList.add('active');
        document.getElementById('pane-filter-block').classList.add('active');
    }
}

// Modal open/close operations
function openFilterModal(e) { e.stopPropagation(); document.getElementById('filter-modal').classList.add('open'); }
function closeFilterModal() { document.getElementById('filter-modal').classList.remove('open'); }

// Determine specific server engine properties via map
function getCalculatedProxyType(category) {
    const cat = category.toLowerCase();
    if (CONFIG.architectureMap.ultraviolet.includes(cat)) return "Ultraviolet v3 Engine Architecture";
    if (CONFIG.architectureMap.rammerhead.includes(cat)) return "Rammerhead Context Proxy Framework";
    return "Node Stealth-Intercept Proxy Module";
}

// Open inspector popup details window
function openProfileModal(url, category) {
    document.getElementById('prof-url-text').textContent = url;
    document.getElementById('prof-arch-type').textContent = getCalculatedProxyType(category);
    document.getElementById('prof-tag-name').textContent = `Category Workspace: ${category}`;
    document.getElementById('profile-modal').classList.add('open');
}
function closeProfileModal() { document.getElementById('profile-modal').classList.remove('open'); }

// Master list compiler engine
function renderProxies() {
    const listTarget = document.getElementById('proxy-list-target'); 
    listTarget.innerHTML = '';
    let compiledLinks = [];
    
    let targetsToRun = selectedCategories.length === 0 ? CONFIG.categories : selectedCategories;

    targetsToRun.forEach(cat => {
        const links = proxyDataStore[cat] || [];
        links.forEach(rawLine => {
            let statusTag = ''; let cleanUrl = rawLine;
            if (rawLine.toLowerCase().includes('[new]')) { statusTag = 'new'; cleanUrl = rawLine.replace(/\[new\]/i, '').trim(); }
            else if (rawLine.toLowerCase().includes('[old]')) { statusTag = 'old'; cleanUrl = rawLine.replace(/\[old\]/i, '').trim(); }
            compiledLinks.push({ url: cleanUrl, status: statusTag, cat: cat });
        });
    });

    if (compiledLinks.length === 0) {
        listTarget.innerHTML = `<li style="color: #52525b; font-size: 0.9rem; text-align:center; padding:3rem; font-weight:500;">No active elements matched within chosen parameters.</li>`;
        return;
    }

    compiledLinks.forEach(item => {
        const li = document.createElement('li'); 
        li.className = 'proxy-card';
        li.onclick = () => openProfileModal(item.url, item.cat);
        let statusBadgeHtml = item.status ? `<span class="badge-status ${item.status}">${item.status}</span>` : '';
        li.innerHTML = `
            <div class="proxy-meta">
                <div class="proxy-url-row">
                    <span class="proxy-url">${item.url}</span>
                    ${statusBadgeHtml}
                </div>
                <div class="proxy-badges-row"><span class="proxy-tag">${item.cat}</span></div>
            </div>
            <button class="action-btn" onclick="event.stopPropagation(); copyToClipboard('${item.url}', this)">Copy Link</button>
        `;
        listTarget.appendChild(li);
    });
}

// Generate category count data cards
function buildMetricsGrid() {
    const target = document.getElementById('metrics-grid-target'); 
    target.innerHTML = '';
    CONFIG.categories.forEach(cat => {
        const count = (proxyDataStore[cat] || []).length;
        const div = document.createElement('div'); 
        div.className = 'metric-item';
        div.innerHTML = `<span class="metric-name">${cat}</span><span class="metric-count">${count}</span>`;
        target.appendChild(div);
    });
}

function openMetricsModal() { document.getElementById('metrics-modal').classList.add('open'); buildMetricsGrid(); }
function closeMetricsModal() { document.getElementById('metrics-modal').classList.remove('open'); }

// Clipboard interaction utility handling
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Link copied successfully!');
        const orig = element.textContent; element.textContent = 'Copied!';
        element.style.background = '#ffffff'; element.style.color = '#000000';
        setTimeout(() => { element.textContent = orig; element.style.background = ''; element.style.color = ''; }, 1000);
    });
}
