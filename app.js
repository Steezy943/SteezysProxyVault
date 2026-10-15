// Main Application State Logic Engine
let selectedCategories = [];
let proxyDataStore = {};

// Handle splash fade sequence and workspace delivery
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const mainContent = document.getElementById('main-content');
        if (splash) splash.style.opacity = '0';
        setTimeout(() => {
            if (splash) splash.style.display = 'none'; 
            if (mainContent) {
                mainContent.style.display = 'block';
                setTimeout(() => { 
                    mainContent.style.opacity = '1'; 
                    showToast("Welcome to Steezy's Proxy Vault"); 
                    initBannerRotation();
                }, 50);
            }
        }, 500);
    }, 1800);
    initApp();
});

// Toast message manager
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
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

// Global Workspace Switching Logic
function changeWorkspaceView(viewMode) {
    document.querySelectorAll('.app-nav-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.workspace-pane').forEach(p => p.classList.remove('active'));
    
    if (viewMode === 'proxies') {
        const tab = document.getElementById('nav-tab-proxies');
        const pane = document.getElementById('workspace-proxies');
        if (tab) tab.classList.add('active');
        if (pane) pane.classList.add('active');
    } else if (viewMode === 'checker') {
        showToast("This feature is still work in progress, expect changes.");
        const tab = document.getElementById('nav-tab-checker');
        const pane = document.getElementById('workspace-checker');
        if (tab) tab.classList.add('active');
        if (pane) pane.classList.add('active');
        executeBlockerGridBuild();
    }
}

// Advanced About:Blank Window Cloaking Script Engine
function launchAboutBlank(url) {
    if (!url) return;
    const targetWin = window.open('about:blank', '_blank');
    if (!targetWin) {
        showToast("Popup blocked! Enable permissions to use cloaked frames.");
        return;
    }
    targetWin.document.body.style.margin = '0';
    targetWin.document.body.style.height = '100vh';
    
    const iframe = targetWin.document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.outline = 'none';
    
    targetWin.document.body.appendChild(iframe);
}

// Banner Announcement Randomizer Loop Engine
function initBannerRotation() {
    const banner = document.getElementById('random-banner');
    if (!banner || !CONFIG.announcements || CONFIG.announcements.length === 0) return;

    let lastIndex = Math.floor(Math.random() * CONFIG.announcements.length);
    banner.textContent = CONFIG.announcements[lastIndex];

    setInterval(() => {
        banner.style.opacity = '0';
        setTimeout(() => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * CONFIG.announcements.length);
            } while (nextIndex === lastIndex && CONFIG.announcements.length > 1);
            lastIndex = nextIndex;
            banner.textContent = CONFIG.announcements[lastIndex];
            banner.style.opacity = '1';
        }, 300);
    }, 8000);
}
// Synchronization handshake with plain text proxy links files
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
    const counter = document.getElementById('global-total-counter');
    if (counter) counter.textContent = `Total Proxies Mapped: ${grandTotal} (Click for breakdown)`;
    buildFilterInterface();
    renderProxies();
    buildMetricsGrid();
}

function buildFilterInterface() {
    const grid = document.getElementById('filter-checkbox-target'); 
    if (!grid) return;
    grid.innerHTML = '';
    CONFIG.categories.forEach(cat => {
        const div = document.createElement('div'); div.className = 'filter-checkbox-card'; div.id = `filter-card-${cat}`;
        div.innerHTML = `<div class="box-indicator"></div><span>${cat}</span>`;
        div.onclick = () => toggleFilterSelection(cat);
        grid.appendChild(div);
    });
}

function toggleFilterSelection(cat) {
    const card = document.getElementById(`filter-card-${cat}`);
    if (selectedCategories.includes(cat)) {
        selectedCategories = selectedCategories.filter(c => c !== cat); if (card) card.classList.remove('selected');
    } else {
        selectedCategories.push(cat); if (card) card.classList.add('selected');
    }
    renderProxies();
}

function resetFiltersAction() {
    selectedCategories = [];
    CONFIG.categories.forEach(cat => {
        const card = document.getElementById(`filter-card-${cat}`);
        if (card) card.classList.remove('selected');
    });
    renderProxies();
    showToast("Filters reset to default view");
}

function switchFilterTab(tabType) {
    document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.filter-view-pane').forEach(p => p.classList.remove('active'));
    if (tabType === 'cat') {
        const tab = document.getElementById('btn-tab-cat');
        const pane = document.getElementById('pane-filter-cat');
        if (tab) tab.classList.add('active');
        if (pane) pane.classList.add('active');
    } else {
        const tab = document.getElementById('btn-tab-block');
        const pane = document.getElementById('pane-filter-block');
        if (tab) tab.classList.add('active');
        if (pane) pane.classList.add('active');
    }
}
function openFilterModal(e) { e.stopPropagation(); const m = document.getElementById('filter-modal'); if (m) m.classList.add('open'); }
function closeFilterModal() { const m = document.getElementById('filter-modal'); if (m) m.classList.remove('open'); }

function getCalculatedProxyType(category) {
    const cat = category.toLowerCase();
    if (CONFIG.architectureMap.ultraviolet.includes(cat)) return "Ultraviolet v4 Frame Engine";
    if (CONFIG.architectureMap.rammerhead.includes(cat)) return "Rammerhead Session Context Proxy";
    return "Node Stealth-Intercept Proxy Module";
}

function openProfileModal(url, category) {
    const pUrl = document.getElementById('prof-url-text');
    const pArch = document.getElementById('prof-arch-type');
    const pTag = document.getElementById('prof-tag-name');
    const modal = document.getElementById('profile-modal');
    if (pUrl) pUrl.textContent = url;
    if (pArch) pArch.textContent = getCalculatedProxyType(category);
    if (pTag) pTag.textContent = `Category Folder: ${category}`;
    if (modal) modal.classList.add('open');
}
function closeProfileModal() { const m = document.getElementById('profile-modal'); if (m) m.classList.remove('open'); }

function renderProxies() {
    const listTarget = document.getElementById('proxy-list-target'); 
    if (!listTarget) return;
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
        listTarget.innerHTML = `<li style="color: #71717a; font-size: 0.9rem; text-align:center; padding:3rem; font-weight:500;">No active elements matched within chosen parameters.</li>`;
        return;
    }

    compiledLinks.forEach(item => {
        const li = document.createElement('li'); li.className = 'proxy-card';
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
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button class="action-btn-secondary" style="padding: 0.55rem 1rem;" onclick="event.stopPropagation(); launchAboutBlank('${item.url}')">Blank Tab</button>
                <button class="action-btn" onclick="event.stopPropagation(); copyToClipboard('${item.url}', this)">Copy</button>
            </div>
        `;
        listTarget.appendChild(li);
    });
}

function buildMetricsGrid() {
    const target = document.getElementById('metrics-grid-target'); 
    if (!target) return;
    target.innerHTML = '';
    CONFIG.categories.forEach(cat => {
        const count = (proxyDataStore[cat] || []).length;
        const div = document.createElement('div'); div.className = 'metric-item';
        div.innerHTML = `<span class="metric-name">${cat}</span><span class="metric-count">${count}</span>`;
        target.appendChild(div);
    });
}

function openMetricsModal() { const m = document.getElementById('metrics-modal'); if (m) m.classList.add('open'); buildMetricsGrid(); }
function closeMetricsModal() { const m = document.getElementById('metrics-modal'); if (m) m.classList.remove('open'); }

/* Site Checker Diagnostic Module Functions */
function executeBlockerGridBuild() {
    const target = document.getElementById('diagnostic-grid-target'); 
    if (!target) return;
    target.innerHTML = '';
    CONFIG.blockers.forEach(b => {
        const div = document.createElement('div'); div.className = 'blocker-status-card';
        div.innerHTML = `<span class="blocker-name">${b}</span><span class="status-badge status-idle" id="diag-status-${b.replace(/\s+/g, '')}">--</span>`;
        target.appendChild(div);
    });
}

async function executeDiagnosticScan() {
    let url = document.getElementById('target-diagnostic-url').value.trim();
    if (!url) { alert('Please supply a target URL to check.'); return; }
    if (!/^https?:\/\//i.test(url)) { url = 'https://' + url; }
    
    CONFIG.blockers.forEach(b => {
        const badge = document.getElementById(`diag-status-${b.replace(/\s+/g, '')}`);
        if (badge) { badge.className = 'status-badge status-idle'; badge.textContent = 'Testing...'; }
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
        await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal, cache: 'no-store' });
        clearTimeout(timeoutId);
        updateBlockerMatrixStatus(false);
    } catch (err) {
        clearTimeout(timeoutId);
        updateBlockerMatrixStatus(true);
    }
}

function updateBlockerMatrixStatus(isRequestBlocked) {
    CONFIG.blockers.forEach(b => {
        const badge = document.getElementById(`diag-status-${b.replace(/\s+/g, '')}`);
        if (badge) {
            if (isRequestBlocked) { badge.className = 'status-badge status-blocked'; badge.innerHTML = '✕ Blocked'; }
            else { badge.className = 'status-badge status-clear'; badge.innerHTML = '✓ Clear'; }
        }
    });
    showToast(isRequestBlocked ? "Bypass verification failed on local client" : "Bypass verified: Node established connection!");
}

function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Link copied successfully!');
        const orig = element.textContent; element.textContent = 'Copied!';
        element.style.background = '#ffffff'; element.style.color = '#000000';
        setTimeout(() => { element.textContent = orig; element.style.background = ''; element.style.color = ''; }, 1000);
    });
}
