module.exports = {
	name: 'join',
    description: 'Joins the calling member\'s voice channel.',
    guildOnly: true,
    args: false,
    usage: '',
	execute(message, args) {
        (async () => {
            // Only try to join the sender's voice channel if they are in one themselves
            let connection;
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
            } else {
                message.reply('You need to join a voice channel first!');
            }

            /* const dispatcher = connection.play('audio.mp4', { volume: 0.25 });
            
            dispatcher.on('finish', () => {
                connection.disconnect();
            });   */
        })();
	},
};