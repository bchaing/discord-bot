const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
	name: 'csgostats',
    description: 'Sends an image with stats of a live csgo game.',
    guildOnly: true,
    args: true,
    usage: '<profile name>',
    cooldown: 5,
	async execute(message, args) {
        // creating puppeteer variables
        const puppeteer = require('puppeteer-extra');
        const StealthPlugin = require('puppeteer-extra-plugin-stealth');
        puppeteer.use(StealthPlugin());

        // creating variables to parse for steam id
        const DOMParser = require('xmldom').DOMParser;
        const fetch = require('node-fetch');
        let steamID;

        // sending status message
        const csgoEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('CSGOSTATS')
            .setDescription('\`[--------------------]\` Retrieving steamID')
            .setTimestamp()
            .setFooter(
                'csgostats.gg', 
            );
        const msg = await message.channel.send({ embed: csgoEmbed });

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
                csgoEmbed.description = `\`[0000----------------]\` Found steamID: ${steamID}`;
                msg.edit({ embed: csgoEmbed });
            } catch (error) {
                csgoEmbed.description = "An error occurred retrieving your steam id";
                msg.edit(csgoEmbed);
                return;
            }
        }


        // creating browser
        csgoEmbed.description = '\`[00000000------------]\` Starting chromium browser';
        msg.edit(csgoEmbed);
        const browser = await puppeteer.launch({
            product: 'chrome',
            executablePath: 'chromium-browser',     // points to chromium browser on raspberry pi
            ignoreHTTPSErrors: true,
            args: ['--window-size=1920,1080'],
            });

        // create a new browser page
        const page = await browser.newPage();
        try {
            // navagate to csgostats live page
            csgoEmbed.description = `\`[000000000000--------]\` Navigating to https://csgostats.gg/player/${ steamID }#/live`;
            msg.edit(csgoEmbed);
            await page.goto(`https://csgostats.gg/player/${ steamID }#/live`, { waitUntil: 'networkidle0' });

            // click on check live game button
            const [button] = await page.$x("//button[contains(., 'Check for live game')]");
            if (button) {
                await button.click();
            }

            // wait for page to load and screen shot the stats element
            csgoEmbed.description = '\`[000000000000--------]\` Waiting for page to load';
            msg.edit(csgoEmbed);
            await page.waitForSelector('#player-live');          // wait for the selector to load
            const element = await page.$('#player-live');        // declare a variable with an ElementHandle
            csgoEmbed.description = '\`[0000000000000000----]\` Taking screenshot';
            msg.edit(csgoEmbed);
            await element.screenshot({ path: './assets/images/csgostats.png' }); // take screenshot element in puppeteer
            csgoEmbed.description = '\`[00000000000000000000]\` Sending image';
            msg.edit(csgoEmbed);
            await browser.close();
        } catch (error) {
            console.log(error);
            csgoEmbed.description = "An error occurred retrieving your csgostats page";
            msg.edit(csgoEmbed);
            browser.close();
            return;
        }

        // send image to the chat
        const file = await new MessageAttachment('./assets/images/csgostats.png');

        const returnEmbed = {
            image: {
                url: 'attachment://csgostats.png',
            },
            color: '#0099ff',
            timestamp: Date.now(),
            footer: { 
                text: 'csgostats.gg', 
            },
        };

        if (file.height == 22) {
            returnEmbed.description = 'Player is not in a live match!';
            console.log('not in match');
            returnEmbed.image = '';
        }

        msg.delete();
        message.channel.send({ files: [file], embed: returnEmbed })
            .then(() => {
                const fs = require('fs');
                const path = './assets/images/csgostats.png';

                try {
                    fs.unlinkSync(path);
                } catch(err) {
                    console.error(err);
                }
            });
	},
};


