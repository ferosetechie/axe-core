const { Builder } = require('selenium-webdriver');
const AxeBuilder = require('axe-webdriverjs');

async function runAccessibilityTests() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get(' https://www.deque.com/'); // Replace with your target URL

        // Run Axe accessibility checks
        const results = await AxeBuilder(driver)
            .analyze();

        // Output results to console or save to a file
        console.log(JSON.stringify(results, null, 2));
    } finally {
        await driver.quit();
    }
}

runAccessibilityTests();