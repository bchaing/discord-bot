const { Command } = require("@sapphire/framework");

class EchoCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      quotes: [],
      aliases: ["say"],
      description: "Replies with the provided text.",
      fullCategory: ["General"],
    });
  }

  async messageRun(message, args) {
    if (args.finished) {
      await message.reply("You did not provide a string.");
      return;
    }

    const text = await args.rest("string");
    await message.channel.send(text).catch(console.error);
  }
}

module.exports = {
  EchoCommand,
};
