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

            // Open a new about:blank tab
            let newTab = window.open('about:blank', '_blank');

            // Set up the content of the new tab
            newTab.document.write(`
                <html>
                    <head>
                        <title>about:blank</title>
                    </head>
                    <body style="margin:0; height:100vh;">
                        <iframe src="${proxiedUrl}" style="border:none; width:100%; height:100%;"></iframe>
                    </body>
                </html>
            `);
            newTab.document.close();

            // Redirect the current tab to Google
            window.location.href = 'https://ultraviolet-static.netlify.app/';

        } catch (error) {
            console.error('Error during form submission:', error);
        }
    });

    function isUrl(val = '') {
        return /^http(s?):\/\//.test(val) || (val.includes('.') && val[0] !== ' ');
    }
});
