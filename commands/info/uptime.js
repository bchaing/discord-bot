const { Command } = require("discord.js-commando");

module.exports = class UptimeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "uptime",
      group: "info",
      memberName: "uptime",
      description: "Returns the uptime of the current bot process.",
    });
  }

  run(message) {
    // variables for time formats
    const uptime = message.client.uptime;
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return message.say(
      `Up for \*\*${days}\*\* days, \*\*${hours % 24}\*\* hours, \*\*${
        minutes % 60
      }\*\* minutes, \*\*${seconds % 60}\*\* seconds`,
    );
  }
};
