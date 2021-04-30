const { Command } = require("discord.js-commando");

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      group: "general",
      memberName: "mute",
      description: 'Converts all messages from a user to "bonk".',
      guildOnly: true,
    });
  }

  run(message) {
    if (!message.mentions.members.size) {
      // check if caller tagged a user to mute
      message.say("You didn't tag a user to mute!");
      return;
    }

    // search for mute role
    const muteRole = message.guild.roles.cache.find(
      (r) => r.name === "bonk-mute",
    );

    // check if mute role exists
    if (!muteRole) {
      message.guild.roles.create({ data: { name: "bonk-mute" } });
    }

    // iterate through tagged members and toggle mute role
    message.mentions.members.each((member) => {
      if (member.roles.cache.some((role) => role.name === "bonk-mute")) {
        member.roles.remove(muteRole);
        message.say(`Unmuted ${member.user}`);
      } else {
        member.roles.add(muteRole);
        message.say(`Muted ${member.user}`);
      }
    });
  }
};
