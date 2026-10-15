// Global Workspace Switching Logic
function changeWorkspaceView(viewMode) {
    // If trying to access the checker, trigger your custom alert and stop execution
    if (viewMode === 'checker') {
        showToast("Not so fast buckaroo! This is coming later.");
        return; // Prevents the screen from switching or blurring
    }

    // Baseline fallback operations for the active proxies workspace view
    document.querySelectorAll('.app-nav-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.workspace-pane').forEach(p => p.classList.remove('active'));
    
    if (viewMode === 'proxies') {
        document.getElementById('nav-tab-proxies').classList.add('active');
        document.getElementById('workspace-proxies').classList.add('active');
    }
}
