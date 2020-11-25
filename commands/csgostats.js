module.exports = {
	name: 'csgostats',
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

            // creating variables to parse for steam id
            const DOMParser = require('xmldom').DOMParser;
            const fetch = require('node-fetch');
            let steamID;

            // sending status message
            const msg = await message.channel.send('\`[--------------------]\` Retrieving steamID');

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
                    console.log(`[CSGOSTATS] Found steamID: ${steamID}`);
                    msg.edit(`\`[0000----------------]\` Found steamID: ${steamID}`);
                } catch (error) {
                    console.log('[CSGOSTATS] Invalid steamID passed or error in steamID processing');
                    msg.edit("An error occurred retrieving your steam id");
                    return;
                }
            }


            // creating browser
            console.log('[CSGOSTATS] Starting chromium browser');
            msg.edit('\`[00000000------------]\` Starting chromium browser');
            const browser = await puppeteer.launch({
                // product: 'chrome',
                // executablePath: 'chromium-browser',     // points to chromium browser on raspberry pi
                headless: true,
                ignoreHTTPSErrors: true,
                args: ['--window-size=1920,1080'],
                });

            // create a new browser page
            const page = await browser.newPage();
            try {
                // navagate to csgostats live page
                console.log(`[CSGOSTATS] Navagating to https://csgostats.gg/player/${ steamID }#/live`);
                msg.edit(`\`[000000000000--------]\` Navagating to https://csgostats.gg/player/${ steamID }#/live`);
                await page.goto(`https://csgostats.gg/player/${ steamID }#/live`, { waitUntil: 'networkidle0' });

                // click on check live game button
                console.log('[CSGOSTATS] Clicking live game button');
                const [button] = await page.$x("//button[contains(., 'Check for live game')]");
                if (button) {
                    await button.click();
                }

                // wait for page to load and screen shot the stats element
                await page.waitForSelector('#player-live');          // wait for the selector to load
                const element = await page.$('#player-live');        // declare a variable with an ElementHandle
                console.log('[CSGOSTATS] Taking screenshot');
                msg.edit('\`[0000000000000000----]\` Taking screenshot');
                await element.screenshot({ path: 'images/csgostats.png' }); // take screenshot element in puppeteer
                await browser.close();
            } catch (error) {
                console.log(error);
                msg.edit("An error occurred retrieving your csgostats page");    
                browser.close();
                return;
            }

            // send image to the chat
            msg.delete();
            await message.channel.send({ files: ['images/csgostats.png'] });
            console.log('[CSGOSTATS] Image sent!');
            
            // delete image after being sent
            const fs = require('fs');
            try {
                fs.unlinkSync('images/csgostats.png');
            } catch (error) {
                console.log(error);
            }
          })();
	},
};


