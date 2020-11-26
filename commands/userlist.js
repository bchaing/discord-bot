module.exports = {
	name: 'userlist',
    description: 'Creates a list of users and their roles',
    guildOnly: false,
    args: false,
    usage: '',
	execute(message, args) {
        const members = message.guild.members.fetch();
        message.channel.send(`${members.map(r => r.user.id)}`);
	},
};