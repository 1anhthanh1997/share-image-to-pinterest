let fs = require("fs");
const puppeteer = require("puppeteer");
let xml2js = require("xml2js");
let parser = new xml2js.Parser();
let newFileName = "action_verbs.xml";

const readFileJson = async () => {
    let xmlData = await fs.readFileSync(newFileName, {encoding: "utf-8"})
    let urls = [];
    await parser.parseString(xmlData, async (err, result) => {
        if (result) {
            if (result.urlset.url) {
                let urlData = result.urlset.url;
                for (let url of urlData) {
                    urls.push(url.loc[0])
                }
            }
        }
    });
    // console.log("Data:", urls)
    return urls;
};

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: "./user_data",
    });
    let worksheetList = await readFileJson()
    let startIndex = 10 *17
    // let worksheetList = ["https://worksheetzone.org/worksheets-khtn-6-bai-7-oxi-nhom-1-617cfdf4ff99af3adc0c7886", "https://worksheetzone.org/worksheets-khtn-6-bai-7-oxi-nhom-2-617cfdf5ff99af3adc0c9abb"]
    for (let index = startIndex; index < startIndex + 10; index++) {
        console.log(worksheetList[index])
        setTimeout(async () => {
            const page = await browser.newPage();
            await page.goto(worksheetList[index]);
            await page.click("button[class='react-share__ShareButton']");
            await page.waitForTimeout(10000);
            const pages = await browser.pages();
            const pinterestPage = pages[pages.length - 1];
            let data = await pinterestPage.$('div[title="Action verbs"]');
            if (!data) {
                await pinterestPage.click("div[data-test-id='create-board']");
                setTimeout(async () => {
                    // await pinterestPage.waitForSelector('input[id=boardEditName]');
                    //
                    // await pinterestPage.$eval('input[id=boardEditName]', el => el.value = 'Test');
                    // await page.focus('#boardEditName')
                    // await page.keyboard.type('test54')
                    await pinterestPage.type('input[id=boardEditName]', 'Action verbs', {delay: 20})
                    await pinterestPage.click("button[type='submit']");
                }, 10000)
            } else {
                await pinterestPage.click("div[data-test-id='board-row-Action verbs']");
            }

        }, (index - startIndex) * 40000);
    }
})();
