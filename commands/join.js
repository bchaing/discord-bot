module.exports = {
	name: 'join',
    description: 'Joins the calling member\'s voice channel.',
    guildOnly: true,
	execute(message) {
        (async () => {
            // Only try to join the sender's voice channel if they are in one themselves
            if (message.member.voice.channel) {
                message.member.voice.channel.join();
                console.log(`Joined voice channel: ${message.member.voice.channel.name}`);
            } else {
                message.reply('You need to join a voice channel first!');
            }
        })();
	},
};