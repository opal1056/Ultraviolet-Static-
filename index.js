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

        // Open go.html in a new window and send the URL
        const goWindow = window.open('go.html', 'goWindow');
        goWindow.onload = () => {
            goWindow.postMessage({ url: proxiedUrl }, '*');
            // Redirect the current page to Google
            window.location.href = 'https://www.google.com';
        };
    } catch (error) {
        console.error('Error during form submission or service worker registration:', error);
    }
});

function isUrl(val = '') {
    return /^http(s?):\/\//.test(val) || (val.includes('.') && val[0] !== ' ');
}
