const { Command } = require("@sapphire/framework");

class PingCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "ping",
      aliases: ["pong"],
      description: "Display the latency of command replies.",
      fullCategory: ["General"],
    });
  }

  async messageRun(message) {
    // send test message
    const msg = await message.channel.send("🏓 Pong!");

    // measure latency and edit message
    const content = `🏓 Pong! \n Bot Latency: \`${Math.round(
      this.container.client.ws.ping,
    )}ms\`\n API Latency: \`${
      msg.createdTimestamp - message.createdTimestamp
    }ms\``;
    return msg.edit(content);
  }
}

module.exports = {
  PingCommand,
};
