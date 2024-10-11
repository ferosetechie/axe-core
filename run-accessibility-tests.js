const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const AxeBuilder = require('axe-webdriverjs');

async function runAccessibilityTests() {
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
        await driver.get('https://www.deque.com/'); // Replace with your target URL

        // Wait for iframes to be present
        await driver.wait(until.elementsLocated(By.tagName('iframe')), 10000);

        // Get all iframes
        const frames = await driver.findElements(By.tagName('iframe'));

        for (let frame of frames) {
            await driver.switchTo().frame(frame); // Switch to the iframe

            // Optional: Configure axe for cross-origin iframes
            await driver.executeScript(`
                axe.configure({
                    allowedOrigins: ['<same_origin>', 'https://your-iframe-url.com']
                });
            `);

            // Run Axe accessibility checks
            const results = await AxeBuilder(driver).analyze();
            console.log(`Accessibility results for frame: ${JSON.stringify(results, null, 2)}`);

            await driver.switchTo().defaultContent(); // Switch back to main content
        }
    } catch (error) {
        console.error("Error running accessibility tests:", error);
    } finally {
        await driver.quit();
    }
}

runAccessibilityTests();
