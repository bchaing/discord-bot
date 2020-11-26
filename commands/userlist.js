module.exports = {
	name: 'userlist',
    description: 'Creates a list of users and their roles',
    guildOnly: false,
    args: false,
    usage: '',
	execute(message) {
        (async () => {
            const members = await message.guild.members.fetch();

            members.map(key => {
                members[key] = key.user.roles.map(r => `${r}`);
                message.channel.send(`${key.user.username} : ${members[key]}`);
            });
          })();
	},
};