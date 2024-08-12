document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const input = form.querySelector('input'); // Selects the input field within the form

    form.addEventListener('submit', async event => {
        event.preventDefault();

        try {
            // Process the URL
            let url = input.value.trim();
            if (!isUrl(url)) {
                url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
                url = 'http://' + url;
            }

            // Construct the proxied URL
            const proxiedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);

            // Open a new about:blank window
            let win = window.open('about:blank', 'proxiedWindow', 'width=100%,height=100%,scrollbars=no,resizable=no');

            // Set up the content of the new window
            win.onload = () => {
                // Set the body style for fullscreen
                win.document.body.style.margin = '0';
                win.document.body.style.height = '100vh';

                // Create and style the iframe
                const iframe = win.document.createElement('iframe');
                iframe.style.border = 'none';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.margin = '0';
                iframe.src = proxiedUrl;
                win.document.body.appendChild(iframe);

                // Redirect the current page to Google
                window.location.href = 'https://www.google.com';
            };

        } catch (error) {
            console.error('Error during form submission:', error);
        }
    });

    function isUrl(val = '') {
        return /^http(s?):\/\//.test(val) || (val.includes('.') && val[0] !== ' ');
    }
});
