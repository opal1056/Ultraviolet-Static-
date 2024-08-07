const form = document.querySelector('form');
const input = document.querySelector('input');

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

        // Open a new window with about:blank and insert the iframe
        const win = window.open('about:blank');
        if (win) {
            win.document.body.style.margin = '0';
            win.document.body.style.height = '100vh';
            const iframe = win.document.createElement('iframe');
            iframe.style.border = 'none';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.margin = '0';
            iframe.src = proxiedUrl;
            win.document.body.appendChild(iframe);
        }
    } catch (error) {
        console.error('Error during form submission or service worker registration:', error);
    }
});

function isUrl(val = '') {
    return /^http(s?):\/\//.test(val) || (val.includes('.') && val[0] !== ' ');
}

