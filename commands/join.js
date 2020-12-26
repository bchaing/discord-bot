module.exports = {
	name: 'join',
    description: 'Joins the calling member\'s voice channel.',
    guildOnly: true,
	execute(message, args) {        
        if (args.length === 0) {
            if (message.member.voice.channel) {
                message.member.voice.channel.join();
                console.log(`Joined voice channel: ${message.member.voice.channel.name}`);
            } else {
                message.reply('You need to specify a voice channel to join!');
            }
        } else {
            const voiceChannel = message.guild.channels.cache.find(vc => vc.name.toLowerCase() === args.join(' ').toLowerCase());
            
            if (voiceChannel) {
                voiceChannel.join();
                console.log(`Joined voice channel: ${voiceChannel.name}`);
            } else {
                message.reply('You need to specify a valid voice channel to join!');
            }
        }
	},
};