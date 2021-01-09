const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class CSGOSTATSCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'csgostats',
            group: 'general',
            memberName: 'csgostats',
            description: 'Sends an image with stats of a live csgo game.',
            guildOnly: true,
            format: '<steam user>',
            args: [
                {
                    key: 'user',
                    prompt: 'Who do you want to look up stats for?',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, { user }) {
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
        const msg = await message.embed(csgoEmbed);

        // completes URL from input
        let customUrl = user;
        if (customUrl.includes('steamcommunity.com/profiles/')) {
            steamID = customUrl.substring(customUrl.search(/\d/));
        } else if (!customUrl.includes('steamcommunity.com/id/')) {
            customUrl = `https://steamcommunity.com/id/${ user }`; 
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
                csgoEmbed.description = oneLine`
                    \`[0000----------------]\` Found steamID: ${steamID}
                `;
                msg.edit({ embed: csgoEmbed });
            } catch (error) {
                csgoEmbed.description = oneLine`
                    An error occurred retrieving your steam id
                `;
                msg.edit(csgoEmbed);
                return;
            }
        }


        // creating browser
        csgoEmbed.description = '\`[00000000------------]\` Starting chromium browser';
        msg.edit(csgoEmbed);
        const browser = await puppeteer.launch({
                /* options for raspberry pi hosting (uncomment the two lines below and delete the headless option) */
                // product: 'chrome',
                // executablePath: 'chromium-browser',
                headless: true,
                ignoreHTTPSErrors: true,
                args: ['--window-size=1920,1080'],
            });

        // create a new browser page
        const page = await browser.newPage();
        try {
            // navagate to csgostats live page
            csgoEmbed.description = oneLine`
                \`[000000000000--------]\` Navigating to 
                https://csgostats.gg/player/${ steamID }#/live
            `;
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
            
            await page.waitForSelector('div #player-live.content-tab.current-tab');          // wait for the selector to load
            const element = await page.$('#player-live');        // declare a variable with an ElementHandle
            csgoEmbed.description = '\`[0000000000000000----]\` Taking screenshot';
            msg.edit(csgoEmbed);
            
            await element.screenshot({ path: './assets/images/csgostats.png' }); // take screenshot element in puppeteer
            csgoEmbed.description = '\`[00000000000000000000]\` Sending image';
            msg.edit(csgoEmbed);
            
            await browser.close();
        } catch (error) {
            console.error(error);
            csgoEmbed.description = "An error occurred retrieving your csgostats page";
            msg.edit(csgoEmbed);
            browser.close();
            return;
        }

        // get size of image and determine if the player is in a live game
        const sizeOf = require('image-size');
        const imageHeight = sizeOf('./assets/images/csgostats.png').height;

        // create embed with final screenshot
        let returnEmbed;
        if (imageHeight === 22) {
        // player is not in a live match
            returnEmbed = {
                description: 'Player is not in a live match.',
                color: '#0099ff',
                timestamp: Date.now(),
                footer: { 
                    text: 'csgostats.gg', 
                },
            };

            message.embed(returnEmbed);
        } else {
        // player is in a live match
            returnEmbed = {
                image: {
                    url: 'attachment://csgostats.png',
                },
                color: '#0099ff',
                timestamp: Date.now(),
                footer: { 
                    text: 'csgostats.gg', 
                },
            };

            await message.channel.send({ files: ['./assets/images/csgostats.png'], embed: returnEmbed });
        }
        
        // delete progress embed and screenshot
        msg.delete();
        
        const fs = require('fs');
        const path = './assets/images/csgostats.png';

        try {
            fs.unlinkSync(path);
        } catch(err) {
            console.error(err);
        }

        return;
    }
};