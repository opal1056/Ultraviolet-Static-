const form = document.querySelector('form');
const input = document.querySelector('input');

form.addEventListener('submit', async event => {
    event.preventDefault();

    try {
        await window.navigator.serviceWorker.register('uv/sw.js', {
            scope: __uv$config.prefix
        });

        let url = input.value.trim();
        if (!isUrl(url)) {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
        } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
            url = 'http://' + url;
        }

        const proxiedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);

        sessionStorage.setItem('proxiedUrl', proxiedUrl);
        window.location.href = 'go.html';
    } catch (error) {
        console.error('Error during form submission or service worker registration:', error);
    }
});

function isUrl(val = '') {
    return /^http(s?):\/\//.test(val) || (val.includes('.') && val[0] !== ' ');
}
