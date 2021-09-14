const { Command } = require("discord.js-commando");

module.exports = class FartCommand extends Command {
  constructor(client) {
    super(client, {
      name: "fart",
      group: "voice",
      memberName: "fart",
      description: "Plays fart noise in voice",
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
    const dispatcher = connection.play("assets/audio/fart.mp3", {
      volume: 0.3,
    });

    // disconnect on audio file finish
    dispatcher.on("finish", () => {
      connection.disconnect();
    });
  }
};
