const { Command } = require("discord.js-commando");

module.exports = class LOLSTATSCommand extends Command {
  constructor(client) {
    super(client, {
      name: "lolstats",
      group: "info",
      memberName: "lolstats",
      description:
        "Sends an image with stats of a live League of Legends game.",
      args: [
        {
          key: "league_user",
          prompt: "Who do you want to look up stats for?",
          type: "string",
        },
      ],
    });
  }

  async run(message, { league_user }) {
    // creating puppeteer variables
    const puppeteer = require("puppeteer-extra");
    const StealthPlugin = require("puppeteer-extra-plugin-stealth");
    puppeteer.use(StealthPlugin());
    const args = league_user.split(/ +/);

    // creates message for status messages
    const msg = await message.channel.send(
      "`[--------------------]` Starting chromium browser",
    );

    // creating browser
    const browser = await puppeteer.launch({
      product: "chrome",
      executablePath: "/usr/bin/chromium-browser", // points to chromium browser on raspberry pi
      ignoreHTTPSErrors: true,
      args: ["--window-size=1920,1920"],
    });

    // parses input user
    msg.edit("`[0000----------------]` Parsing user from input");
    let userName = "";
    for (let i = 0; i < args.length; i++) {
      if (i != 0) {
        userName += "%20";
      }
      userName += args[i];
    }

    // create a new browser page
    const page = await browser.newPage();
    try {
      // navagate to league of legends live page
      msg.edit(
        `\`[00000000------------]\` Navigating to https://u.gg/lol/profile/na1/${userName}/live-game`,
      );
      await page.goto(`https://u.gg/lol/profile/na1/${userName}/live-game`);

      // wait for page to load and screen shot the stats element
      msg.edit("`[000000000000--------]` Waiting for page to load");
      await page.waitForSelector(
        "#content > div.summoner-profile-container.content-side-padding > div.summoner-profile_content-container > div > div.live-game-container > div",
      ); // wait for the selector to load
      const element = await page.$(
        "#content > div.summoner-profile-container.content-side-padding > div.summoner-profile_content-container > div > div.live-game-container > div",
      ); // declare a variable with an ElementHandle
      msg.edit("`[0000000000000000----]` Taking screenshot");
      await element.screenshot({ path: "assets/images/lolstats.png" }); // take screenshot element in puppeteer
      msg.edit("`[00000000000000000000]` Sending screenshot");
      await browser.close();
    } catch (error) {
      msg.edit("An error occurred retrieving your lolstats page");
      browser.close();
      return;
    }

    // send image to the chat
    msg.delete();
    message.channel.send({ files: ["assets/images/lolstats.png"] });
  }
};
