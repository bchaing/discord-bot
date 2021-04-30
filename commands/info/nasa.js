const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { nasaAPIKey } = require("../../config.json");
const { oneLine } = require("common-tags");
const fetch = require("node-fetch");

module.exports = class NASACommand extends Command {
  constructor(client) {
    super(client, {
      name: "nasa",
      group: "info",
      memberName: "nasa",
      description: "Displays NASA's astronomy picture of the day.",
    });
  }

  async run(message) {
    if (!nasaAPIKey) {
      return message.reply(oneLine`
                The API key has not been set up for this command.
                If you like to use this command, please contact the bot owner.
            `);
    }

    const url = `https://api.nasa.gov/planetary/apod?api_key=${nasaAPIKey}`;
    const response = await fetch(url);
    const json = await response.json();

    const APODEmbed = new MessageEmbed()
      .setColor(0x0b3d91)
      .setAuthor("NASA's Astronomy Picture of the Day", "attachment://nasa.png")
      .attachFiles("./assets/images/nasa.png")
      .setTitle(json.title)
      .setDescription(json.explanation)
      .setImage(json.hdurl);

    return message.embed(APODEmbed);
  }
};
