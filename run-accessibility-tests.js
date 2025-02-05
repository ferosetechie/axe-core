const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const AxeBuilder = require("@axe-core/webdriverjs");
const fs = require("fs");

// Get CLI arguments
const targetUrl = process.argv[2] || "https://www.deque.com/";
const isHeadless = process.argv.includes("--headless");

// Initialize WebDriver with Chrome options
(async function runTests() {
    let options = new chrome.Options();

    if (isHeadless) {
        options.addArguments("--headless=new"); // ✅ Use new headless mode for stability
        console.log("🚀 Running in HEADLESS mode.");
    } else {
        console.log("🚀 Running in VISIBLE mode.");
    }

    options.addArguments(
        "--start-maximized",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--remote-allow-origins=*",
        "--user-data-dir=/tmp/chrome-profile" // ✅ Fix Chrome session conflict
    );

    let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    let results = [];

    try {
        console.log(`🔎 Testing: ${targetUrl}`);
        await driver.get(targetUrl);
        await driver.sleep(2000); // Allow page load

        // ✅ Try switching to iframe (if present)
        try {
            let iframe = await driver.findElement(By.css("iframe"));
            await driver.switchTo().frame(iframe);
            console.log("✅ Switched to iframe");
        } catch {
            console.log("⚠️ No iframe found, continuing...");
        }

        // ✅ Check if username field exists
        try {
            await driver.wait(until.elementLocated(By.id("username")), 5000);
            results.push({ test: "Username Field Exists", status: "PASS" });
        } catch (err) {
            results.push({ test: "Username Field Exists", status: "FAIL", error: err.message });
        }

        // ✅ Login test
        try {
            await driver.findElement(By.id("username")).sendKeys("testuser");
            await driver.findElement(By.id("password")).sendKeys("testpassword");
            await driver.findElement(By.css('button[type="submit"]')).click();
            await driver.wait(until.urlContains("/dashboard"), 5000);
            results.push({ test: "Login Test", status: "PASS" });
        } catch (err) {
            results.push({ test: "Login Test", status: "FAIL", error: err.message });
        }

        // ✅ Button Responsiveness Test
        try {
            let button = await driver.findElement(By.css("button"));
            if (await button.isDisplayed() && await button.isEnabled()) {
                results.push({ test: "Button Visibility & Clickable", status: "PASS" });
            } else {
                results.push({ test: "Button Visibility & Clickable", status: "FAIL" });
            }
        } catch (err) {
            results.push({ test: "Button Visibility & Clickable", status: "FAIL", error: err.message });
        }

        // ✅ Run axe-core accessibility test
        try {
            let axeResults = await new AxeBuilder(driver).analyze();
            results.push({ test: "Axe Accessibility Check", status: "DONE", violations: axeResults.violations });
            fs.writeFileSync("accessibility-results.json", JSON.stringify(axeResults, null, 2));
            console.log("✅ Accessibility results saved to accessibility-results.json");
        } catch (err) {
            results.push({ test: "Axe Accessibility Check", status: "FAIL", error: err.message });
        }

    } catch (err) {
        console.error("❌ Test execution error:", err);
    } finally {
        console.log("\n📊 Test Results:");
        console.table(results); // Display formatted results
        await driver.quit();
    }
})();
