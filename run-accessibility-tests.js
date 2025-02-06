const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const AxeBuilder = require("@axe-core/webdriverjs");
const fs = require("fs");

const targetUrl = process.argv[2] || "https://www.deque.com/";
const isHeadless = process.argv.includes("--headless");

(async function runTests() {
    let options = new chrome.Options();

    // ✅ Force a unique Chrome profile to avoid session conflicts
    const uniqueProfile = `/tmp/chrome-profile-${Math.random().toString(36).substring(7)}`;
    options.addArguments(`--user-data-dir=${uniqueProfile}`);
    
    if (isHeadless) {
        options.addArguments("--headless=new"); // ✅ Use latest headless mode
        console.log("🚀 Running in HEADLESS mode.");
    } else {
        console.log("🚀 Running in VISIBLE mode.");
    }

    options.addArguments(
        "--disable-gpu",
        "--no-sandbox", // ✅ Prevents permission issues in Jenkins
        "--disable-dev-shm-usage", // ✅ Fix shared memory issue
        "--disable-extensions",
        "--disable-background-mode",
        "--remote-allow-origins=*", 
        "--disable-popup-blocking"
    );

    let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

    try {
        console.log(`🔎 Testing: ${targetUrl}`);
        await driver.get(targetUrl);
        await driver.sleep(2000);

        // ✅ Run axe-core accessibility test
        let axeResults = await new AxeBuilder(driver).analyze();
        fs.writeFileSync("accessibility-results.json", JSON.stringify(axeResults, null, 2));
        console.log("✅ Accessibility results saved to accessibility-results.json");

    } catch (err) {
        console.error("❌ Test execution error:", err);
        process.exit(1);
    } finally {
        await driver.quit();
    }
})();
