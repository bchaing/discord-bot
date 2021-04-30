const { Command } = require("discord.js-commando");
const { sendWebhookMessage } = require("../../util/Util");

module.exports = class EmojifyCommand extends Command {
  constructor(client) {
    super(client, {
      name: "emojify",
      group: "fun",
      memberName: "emojify",
      description: "Adds emojis between words in a message.",
      format: "<message>",
      args: [
        {
          key: "msg",
          prompt: "",
          type: "string",
          default: "",
        },
      ],
    });
  }

  run(message, { msg }) {
    const args = msg.split(/ +/),
      emojis = message.guild.emojis.cache; // stores the emojis of the guild
    let randomEmoji, returnMsg, emoji; // variables for parsing animated emoji's
    let returnMessage = ""; // message to send at the end

    // loops through every word, adding emoji's between
    for (let i = 0, j = args.length; i < j; i++) {
      randomEmoji = emojis.random();
      returnMsg = args[i];
      emoji = message.guild.emojis.cache.find(
        (e) =>
          e.name.toLowerCase() ===
          `${returnMsg.replace(/:/g, "").toLowerCase()}`,
      );

      // checks if user is trying to send an emoji without nitro
      if (emoji) returnMsg = emoji;

      returnMessage = `${returnMessage}${returnMsg}${randomEmoji}`;
    }

    sendWebhookMessage(
      message.channel,
      message.member.displayName,
      message.author.avatarURL(),
      returnMessage,
    );

    // deletes original message
    message.delete().catch((error) => {
      // Only log the error if it is not an Unknown Message error
      if (error.code !== 10008) {
        console.error("Failed to delete the message:", error);
      }
    });

    return;
  }
};
