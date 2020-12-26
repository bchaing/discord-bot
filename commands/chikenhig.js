module.exports = {
	name: 'chikenhig',
    description: 'Plays chikenhig insults.',
    guildOnly: true,
	execute(message) {
        // Only try to join the sender's voice channel if they are in one themselves
        let connection;
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join().catch(console.error);
            console.log(`Joined voice channel: ${message.member.voice.channel.name}`);
        } else {
            message.reply('You are not connected to a valid voice channel!');
            return;
        }

        const dispatcher = connection.play('assets/audio/chikenhig.mp3', { volume: 0.30 });
        console.log('Playing chickenhig.mp3');            

        dispatcher.on('finish', () => {
            connection.disconnect();
        });
	},
};