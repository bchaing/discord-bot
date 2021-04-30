const { Command } = require("discord.js-commando");
const fetch = require("node-fetch");

module.exports = class RandomCatCommand extends Command {
  constructor(client) {
    super(client, {
      name: "randomcat",
      aliases: ["meow", "cat", "purr"],
      group: "fun",
      memberName: "randomcat",
      description: "Sends a random image of a cat.",
    });
  }

  async run(message) {
    const url = "https://api.thecatapi.com/v1/images/search";
    const response = await fetch(url);
    const json = await response.json();

    return message.say(json[0].url);
  }
};
