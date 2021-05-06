const { Command } = require("discord.js-commando");
const { Util } = require("discord.js");

module.exports = class RandomCommand extends Command {
  constructor(client) {
    super(client, {
      name: "random",
      group: "fun",
      memberName: "random",
      description: "Gets a random user from the server.",
      guildOnly: true,
    });
  }

  run(message) {
    return message.say(
      `${Util.removeMentions(
        message.guild.members.cache.filter((m) => !m.bot).random().displayName,
      )}`,
    );
  }
};
