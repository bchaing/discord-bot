module.exports = {
	name: 'chikenhig',
    description: 'Plays chikenhig insults in user\'s voice channel or specified channel.',
    guildOnly: true,
	usage: '<voice channel>',
	async execute(message, args) {
        let connection;
        
        if (args.length === 0) {
        // if no channel is explicitly specified, join author's voice channel if possible
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                console.log(`Joined voice channel: ${message.member.voice.channel.name}`);
            } else {
                message.reply('You need to specify a voice channel to join!');
            }
        } else {
        // channel is explicitly specified, search for channel and join if possible
            const voiceChannel = message.guild.channels.cache.find(vc => vc.name.toLowerCase() === args.join(' ').toLowerCase());
            
            if (voiceChannel) {
                connection = await voiceChannel.join();
                console.log(`Joined voice channel: ${voiceChannel.name}`);
            } else {
                message.reply('You need to specify a valid voice channel to join!');
            }
        }

        // play audio file
        const dispatcher = connection.play('assets/audio/chikenhig.mp3', { volume: 0.30 });
        console.log('Playing chickenhig.mp3');            

        // disconnect on audio file finish
        dispatcher.on('finish', () => {
            connection.disconnect();
            console.log(`Left voice channel: ${message.guild.me.voice.channel.name}`);
        });
	},
};