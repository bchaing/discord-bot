module.exports = {
	name: 'lolstats',
    description: 'Sends an image with stats of a live League of Legends game.',
    guildOnly: true,
    args: true,
    usage: '<profile name>',
    cooldown: 5,
	execute(message, args) {
        (async () => {
            // creating puppeteer variables
            const puppeteer = require('puppeteer-extra');
            const StealthPlugin = require('puppeteer-extra-plugin-stealth');
            puppeteer.use(StealthPlugin());

            // creating browser
            const browser = await puppeteer.launch({
                headless: true, // The browser is visible
                ignoreHTTPSErrors: true,
                args: ['--window-size=1920,1080'],
            });

            // completes URL from input
            const userName = args[0];

            // presses okay button from cookies


            // create a new browser page
            const page = await browser.newPage();
            const form = await page.$('body > div > div.message.type-bottom.no-border > div.message-component.message-row.message-row > button.message-component.message-button.no-children.accept-button');
            await form.evaluate( form => form.click() );

            try {
                // navagate to league of legends live page
                await page.goto(`https://u.gg/lol/profile/na1/${userName}/live-game`, { waitUntil: 'networkidle0' });

                // wait for page to load and screen shot the stats element
                await page.waitForSelector('#content > div.summoner-profile-container.content-side-padding > div.summoner-profile_content-container > div > div.live-game-container > div');          // wait for the selector to load
                const element = await page.$('#content > div.summoner-profile-container.content-side-padding > div.summoner-profile_content-container > div > div.live-game-container > div');        // declare a variable with an ElementHandle
                await element.screenshot({ path: 'images/lolstats.png' }); // take screenshot element in puppeteer
            } catch (error) {
                message.channel.send("An error occurred retrieving your lolstats page");
                return;
            }

            // send image to the chat
            message.channel.send({ files: ['images/lolstats.png'] });
          })();
	},
};


