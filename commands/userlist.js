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

            await members.map(key => {members[key] = key.roles.cache;});
            
            fs.writeFileSync('modules/rolepersist.json', JSON.stringify(members), 'utf-8'); 
          })();
	},
};