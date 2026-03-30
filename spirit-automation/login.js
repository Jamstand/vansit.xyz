require('dotenv').config();
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// ============================================================
// S.P.I.R.I.T. Login Automation
// ============================================================
// Update the selectors below once you have the actual login page.
// Use your browser's DevTools (right-click > Inspect) to find
// the correct CSS selectors for the username, password, and
// submit button fields.
// ============================================================

const CONFIG = {
  url: process.env.SPIRIT_URL,
  username: process.env.SPIRIT_USERNAME,
  password: process.env.SPIRIT_PASSWORD,
  headless: process.env.HEADLESS === 'true',

  // ---- UPDATE THESE SELECTORS ----
  // These are common defaults. Inspect the login page and
  // replace with the actual selectors.
  selectors: {
    usernameField: 'input[name="username"], input[type="text"], #username',
    passwordField: 'input[name="password"], input[type="password"], #password',
    submitButton: 'button[type="submit"], input[type="submit"], #loginBtn',
  },

  // How long to wait for login to complete (ms)
  loginTimeout: 30000,
};

async function login() {
  // Validate config
  if (!CONFIG.url || !CONFIG.username || !CONFIG.password) {
    console.error('Missing required environment variables.');
    console.error('Copy .env.example to .env and fill in your values.');
    process.exit(1);
  }

  console.log(`Launching browser (headless: ${CONFIG.headless})...`);
  const browser = await chromium.launch({ headless: CONFIG.headless });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    console.log(`Navigating to: ${CONFIG.url}`);
    await page.goto(CONFIG.url, { waitUntil: 'networkidle' });

    // Fill in credentials
    console.log('Filling in credentials...');
    await page.fill(CONFIG.selectors.usernameField, CONFIG.username);
    await page.fill(CONFIG.selectors.passwordField, CONFIG.password);

    // Click submit
    console.log('Submitting login form...');
    await page.click(CONFIG.selectors.submitButton);

    // Wait for navigation after login
    await page.waitForLoadState('networkidle', { timeout: CONFIG.loginTimeout });

    // Take a screenshot to verify login succeeded
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir);
    }
    const screenshotPath = path.join(screenshotDir, `login-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);

    console.log('Login successful! Current URL:', page.url());

    // ---- ADD YOUR POST-LOGIN ACTIONS HERE ----
    await afterLogin(page);

  } catch (error) {
    console.error('Login failed:', error.message);

    // Save error screenshot
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir);
    }
    await page.screenshot({
      path: path.join(screenshotDir, `error-${Date.now()}.png`),
      fullPage: true,
    });
    console.error('Error screenshot saved.');
  } finally {
    await browser.close();
  }
}

// Add your post-login workflow here
async function afterLogin(page) {
  console.log('Ready for post-login actions.');
  // Example: navigate to a specific page after login
  // await page.goto('https://spirit.example.com/records');
  // await page.waitForLoadState('networkidle');

  // Example: click a menu item
  // await page.click('#recordsMenu');

  // Example: search for something
  // await page.fill('#searchBox', 'search term');
  // await page.click('#searchBtn');
}

login();
