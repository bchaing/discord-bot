module.exports = {
	name: 'leave',
    description: 'Disconnects the bot from the voice channel if current connected to one.',
    guildOnly: true,
	cooldown: 0,
	execute(message) {
        if (message.guild.me.voice.channel !== undefined) {
            message.guild.me.voice.channel.leave();
            console.log(`Left voice channel: ${message.guild.me.voice.channel.name}`);
        } else {
            message.reply('No active voice channel connections!');
        }
	},
};