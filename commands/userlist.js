const fs = require('fs');

module.exports = {
	name: 'userlist',
    description: 'Creates a list of users and their roles',
    guildOnly: false,
    args: false,
    usage: '',
	execute(message) {
        (async () => {
            const members = await message.guild.members.fetch();
            members.map((value, key) => {
                members.delete(key);
                members.set(key, value.roles.cache);
            });
            
            const jsonData = Object.fromEntries(members);

            fs.writeFileSync('modules/rolepersist.json', JSON.stringify(jsonData), 'utf-8'); 
          })();
	},
};
