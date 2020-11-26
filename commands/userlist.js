module.exports = {
	name: 'userlist',
    description: 'Creates a list of users and their roles',
    guildOnly: false,
    args: false,
    usage: '',
	execute(message, args) {
        (async () => {
            const members = await message.guild.members.fetch();
            message.channel.send(`${members.map(m => m.user.id)}`);
          })();
	},
};