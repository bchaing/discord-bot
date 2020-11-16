module.exports = {
	name: 'lolstats',
    description: 'Sends an image with stats of a live csgo game.',
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

            // creating variables to parse for steam id
            const DOMParser = require('xmldom').DOMParser;
            const fetch = require('node-fetch');
            let steamID;

            // completes URL from input
            let customUrl = args[0];
            if (customUrl.includes('steamcommunity.com/profiles/')) {
                steamID = customUrl.substring(customUrl.search(/\d/));
            } else if (!customUrl.includes('steamcommunity.com/id/')) {
                customUrl = `https://steamcommunity.com/id/${ args[0] }`; 
            }

            // getting steam id from URL
            if (!steamID) {
                try {
                    const url = customUrl.concat("?xml=1");
                    const resp = await fetch(url);
                    const text = await resp.text();
                    const doc = new DOMParser().parseFromString(text);
                    const ele = doc.documentElement.getElementsByTagName("steamID64");
                    steamID = ele.item(0).firstChild.nodeValue;
                } catch (error) {
                    // console.log(error);
                    message.channel.send("An error occurred retrieving your steam id");
                    return;
                }
            }

            // create a new browser page
            const page = await browser.newPage();
            try {
                // navagate to csgostats live page
                await page.goto(`https://csgostats.gg/player/${ steamID }#/live`, { waitUntil: 'networkidle0' });

                // click on check live game button
                const [button] = await page.$x("//button[contains(., 'Check for live game')]");
                if (button) {
                    await button.click();
                }

                // wait for page to load and screen shot the stats element
                await page.waitForSelector('#player-live');          // wait for the selector to load
                const element = await page.$('#player-live');        // declare a variable with an ElementHandle
                await element.screenshot({ path: 'images/csgostats.png' }); // take screenshot element in puppeteer
            } catch (error) {
                message.channel.send("An error occurred retrieving your csgostats page");
                return;
            }

            // send image to the chat
            message.channel.send({ files: ['images/csgostats.png'] });
          })();
	},
};

