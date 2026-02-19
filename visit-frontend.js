const puppeteer = require('puppeteer');

const TARGET_URLS = [
    'https://todayfor.vercel.app/',
    'https://qrlinks.vercel.app/r/tt7prJwfjX'
];

async function run() {
    console.log('Starting keep-alive check...');
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set a realistic user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        for (const url of TARGET_URLS) {
            console.log(`Visitting: ${url}`);
            try {
                await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

                // Wait for additional 5 seconds to ensure useEffects and API calls trigger
                await new Promise(resolve => setTimeout(resolve, 5000));

                const title = await page.title();
                console.log(`Success: ${url} (Title: ${title})`);
            } catch (e) {
                console.error(`Failed to visit ${url}:`, e.message);
                // We continue to next URL even if one fails
            }
        }

        console.log('Keep-alive check completed.');

    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

run();
