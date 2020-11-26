module.exports = {
	name: 'userlist',
    description: 'Creates a list of users and their roles',
    guildOnly: false,
    args: false,
    usage: '',
	execute(message) {
        (async () => {
            const members = await message.guild.members.fetch();
            members[140944479090638848] = "test";
            message.channel.send(`${members.map(m => m.user.id)}`);
          })();
	},
};