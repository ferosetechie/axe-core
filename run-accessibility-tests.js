const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const AxeBuilder = require('axe-webdriverjs');

async function runAccessibilityTests() {
    // Set Chrome options
    let options = new chrome.Options();
    options.addArguments('--headless'); // Run in headless mode
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu'); // Optional but can help in some environments
    options.addArguments('--remote-debugging-port=9222'); // Optional for debugging

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('https://www.deque.com/'); // Replace with your target URL

        // Wait for iframes to load if necessary
        await driver.sleep(2000); // Adjust the sleep time as needed

        // Run Axe accessibility checks
        const results = await AxeBuilder(driver).analyze();

        // Output results to console or save to a file
        console.log(JSON.stringify(results, null, 2));
    } catch (error) {
        console.error("Error running accessibility tests:", error);
    } finally {
        await driver.quit();
    }
}

runAccessibilityTests();
