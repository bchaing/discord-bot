const fs = require('fs');

module.exports = {
	name: 'useradd',
    description: 'Adds all the roles to a user',
    guildOnly: false,
    args: false,
    usage: '<user>',
	execute(message, args) {
        const data = fs.readFileSync('modules/rolepersist.json');
        const rolemap = new Map(Object.entries(data));
        console.log(rolemap['140944479090638848']);
    }
}
