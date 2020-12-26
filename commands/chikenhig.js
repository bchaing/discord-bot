module.exports = {
	name: 'chikenhig',
    description: 'Plays chikenhig insults.',
    guildOnly: true,
	execute(message, args) {
        (async () => {
            // Only try to join the sender's voice channel if they are in one themselves
            let connection;
            if (args.length === 0) {
                if (message.member.voice.channel) {
                    connection = await message.member.voice.channel.join();
                    console.log(`Joined voice channel: ${message.member.voice.channel.name}`);
                } else {
                    message.reply('You need to specify a voice channel to join!');
                }
            } else {
                const voiceChannel = message.guild.channels.cache.find(vc => vc.name.toLowerCase() === args.join(' ').toLowerCase());
                
                if (voiceChannel) {
                    connection = await voiceChannel.join();
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
        })();
	},
};