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

            /* await members.map(key => {
                members.delete(key);
                // members[key.id] = key.roles.cache; 
            }); */

            for (const [key, value] of members.entries()) {
                members.set(value, value.roles.cache);
                members.delete(key);
            }
            
            fs.writeFileSync('modules/rolepersist.json', JSON.stringify(members), 'utf-8'); 
          })();
	},
};