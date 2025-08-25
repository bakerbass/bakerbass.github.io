// loadnav.js
document.addEventListener("DOMContentLoaded", function() {
    // Append a short-lived cache-busting query and request no-store to prefer network
    const url = 'nav.html?v=' + Date.now();
    fetch(url, { cache: 'no-store' })
        .then(response => response.text())
        .then(data => {
            document.getElementById('nav-placeholder').innerHTML = data;
        })
        .catch(err => {
            // Fallback to a plain fetch if something goes wrong
            console.warn('Cache-busted nav fetch failed, falling back:', err);
            fetch('nav.html')
                .then(r => r.text())
                .then(data => document.getElementById('nav-placeholder').innerHTML = data)
                .catch(e => console.error('Failed to load nav.html:', e));
        });
});