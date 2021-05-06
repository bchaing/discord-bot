const { Command } = require("discord.js-commando");
const { oneLine } = require("common-tags");

module.exports = class ChikenhigCommand extends Command {
  constructor(client) {
    super(client, {
      name: "chikenhig",
      group: "voice",
      memberName: "chikenhig",
      description: oneLine`
                Plays chikenhig\'s insults in user\'s
                voice channel or specified channel.
            `,
      guildOnly: true,
      args: [
        {
          key: "channel",
          prompt: "Which voice channel should the bot join?",
          type: "voice-channel",
          default: "",
        },
      ],
    });
  }

  async run(message, { channel }) {
    if (!channel && message.member.voice.channel) {
      channel = message.member.voice.channel;
    } else if (!channel) {
      return message.reply("You need to specify a voice channel!");
    }

    const connection = await channel.join();

    // play audio file
    const dispatcher = connection.play("assets/audio/chikenhig.mp3", {
      volume: 0.3,
    });

    // disconnect on audio file finish
    dispatcher.on("finish", () => {
      connection.disconnect();
    });
  }
};
