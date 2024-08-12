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

        // Open a new window with about:blank and set its content
        const newWindow = window.open('about:blank', 'proxiedWindow', 'width=100%,height=100%,scrollbars=no,resizable=no');

        // Check if the window opened successfully
        if (newWindow) {
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Proxy</title>
                    <style>
                        body, html {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }
                        iframe {
                            width: 100%;
                            height: 100%;
                            border: none;
                        }
                    </style>
                </head>
                <body>
                    <iframe src="${proxiedUrl}"></iframe>
                </body>
                </html>
            `);
            newWindow.document.close(); // Important to call document.close()

            // Redirect the current page to Google
            window.location.href = 'https://www.google.com';
        } else {
            console.error('Failed to open the new window.');
        }
    } catch (error) {
        console.error('Error during form submission or service worker registration:', error);
    }
});

function isUrl(val = '') {
    return /^http(s?):\/\//.test(val) || (val.includes('.') && val[0] !== ' ');
}
