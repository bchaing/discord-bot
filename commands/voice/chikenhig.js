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
          prompt: "",
          type: "string",
          default: "",
        },
      ],
    });
  }

  async run(message, { channel }) {
    let connection;
    if (!channel) {
      // if no channel is explicitly specified, join author's voice channel
      if (message.member.voice.channel) {
        connection = await message.member.voice.channel.join();
      } else {
        message.reply("You need to specify a voice channel to join!");
      }
    } else {
      // channel is explicitly specified, search for channel and join
      let voiceChannel;

      // allow for vc mentions or just plain text
      if (message.mentions.roles.size != 0) {
        voiceChannel = message.guild.channels.cache.find((vc) =>
          message.mentions.roles.some((role) => role.name === vc.name),
        );
      } else {
        voiceChannel = message.guild.channels.cache.find(
          (vc) => vc.name.toLowerCase() === channel.toLowerCase(),
        );
      }

      if (voiceChannel) {
        connection = await voiceChannel.join();
      } else {
        message.reply("You need to specify a voice channel to join!");
        return;
      }
    }

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
