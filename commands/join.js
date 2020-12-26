module.exports = {
	name: 'join',
    description: 'Joins the calling member\'s voice channel or specified voice channel.',
    guildOnly: true,
	usage: '<voice channel>',
	execute(message, args) {        
        if (args.length === 0) {
        // check if user specified a voice channel
            if (message.member.voice.channel) {
            // join user's voice channel if possible
                message.member.voice.channel.join();
                console.log(`Joined voice channel: ${message.member.voice.channel.name}`);
            } else {
            // sends response if unable to join
                message.reply('You need to specify a voice channel to join!');
            }
        } else {
        // search for user specified channel and attempt to join
            const voiceChannel = message.guild.channels.cache.find(vc => vc.name.toLowerCase() === args.join(' ').toLowerCase());
            
            if (voiceChannel) {
            // join voice channel if found
                voiceChannel.join();
                console.log(`Joined voice channel: ${voiceChannel.name}`);
            } else {
            // notifies user that voice channel could not be found
                message.reply('You need to specify a valid voice channel to join!');
            }
        }
	},
};