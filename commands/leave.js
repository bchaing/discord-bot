module.exports = {
	name: 'leave',
    description: 'Disconnects the bot from the voice channel if current connected to one.',
    guildOnly: true,
	cooldown: 0,
	execute(message) {
        // check voice channel connection and leave if necessary
        if (message.guild.me.voice.channel !== null) {
            // leave current voice channel
            message.guild.me.voice.channel.leave();
            console.log(`Left voice channel: ${message.guild.me.voice.channel.name}`);
        } else {
            // bot is not in a voice channel
            message.reply('No active voice channel connections!');
        }
	},
};