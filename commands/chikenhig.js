module.exports = {
	name: 'chikenhig',
    description: 'Plays chikenhig insults.',
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

        const dispatcher = connection.play('assets/audio/chikenhig.mp3', { volume: 0.30 });
        console.log('Playing chickenhig.mp3');            

        dispatcher.on('finish', () => {
            connection.disconnect();
        });
	},
};