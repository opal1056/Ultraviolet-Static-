const form = document.querySelector('form');
const input = document.querySelector('input');
const iframe = document.getElementById('dashboard-frame');

form.addEventListener('submit', async event => {
    event.preventDefault();

    try {
        // Register the service worker
        await window.navigator.serviceWorker.register('uv/sw.js', {
            scope: __uv$config.prefix
        });

        // Process the URL
        let url = input.value.trim();
        if (!isUrl(url)) {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
        } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
            url = 'http://' + url;
        }

        // Construct the proxied URL
        const proxiedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);

        // Set the src of the iframe to the proxied URL
        iframe.src = proxiedUrl;
    } catch (error) {
        console.error('Error during form submission or service worker registration:', error);
    }
});

function isUrl(val = '') {
    return /^http(s?):\/\//.test(val) || (val.includes('.') && val[0] !== ' ');
}
