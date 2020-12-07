module.exports = {
	name: 'chikenhig',
    description: 'Plays chikenhig insults.',
    guildOnly: true,
    args: false,
    usage: '',
	execute(message) {
        (async () => {
            // Only try to join the sender's voice channel if they are in one themselves
            let connection;
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
            } else {
                message.reply('You need to join a voice channel first!');
            }

            const dispatcher = connection.play('audio\chikenhig.mp4', { volume: 0.30 });
            
            dispatcher.on('finish', () => {
                connection.disconnect();
            });
        })();
	},
};