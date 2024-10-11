const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const AxeBuilder = require('axe-webdriverjs');
const fs = require('fs');

async function runAccessibilityTests(targetUrl) {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(targetUrl); // Use the parameterized URL

        // Inject axe-core into the page
        await driver.executeScript(`
            var script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.0.2/axe.min.js';
            document.head.appendChild(script);
        `);

        // Wait for axe-core to load
        await driver.sleep(2000); // Adjust as needed

        // Run Axe accessibility checks
        const results = await AxeBuilder(driver).analyze();

        // Output results to a JSON file
        fs.writeFileSync('accessibility-results.json', JSON.stringify(results, null, 2));
        console.log("Accessibility results saved to accessibility-results.json");

    } catch (error) {
        console.error("Error running accessibility tests:", error);
    } finally {
        await driver.quit();
    }
}

// Get URL from command line arguments
const targetUrl = process.argv[2];
runAccessibilityTests(targetUrl);
