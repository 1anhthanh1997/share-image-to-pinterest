const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./user_data",
  });
  for (let index = 0; index < 100; index++) {
    setTimeout(async () => {
      const page = await browser.newPage();
      await page.goto("https://worksheetzone.org/");
      await page.click("button[class='react-share__ShareButton']");
      await page.waitForTimeout(3000);
      const pages = await browser.pages();
      const pinterestPage = pages[pages.length - 1];
      await pinterestPage.click("div[data-test-id='board-row-Test']");
    }, index * 40000);
  }
})();
