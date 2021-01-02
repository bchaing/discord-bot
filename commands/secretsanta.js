const { Collection } = require('discord.js');

module.exports = {
	name: 'secretsanta',
    description: 'Commands useful for hosting a secret santa gift exchange.',
    guildOnly: false,
    args: false,
    aliases: ['drawnames'],
	usage: '',
	cooldown: 0,
	execute(message, args) {
        if (args[0] === 'draw') {
            const members = message.channel.members.map(member => {
                if (!member.user.bot) return member.user.username;
            }).filter(member => member != undefined);

            let temp, j, i = members.length;

            while (i) {
                j = Math.floor(Math.random() * i--);

                temp = members[i];
                members[i] = members[j];
                members[j] = temp;
            }

            const pairs = new Collection();

            members.forEach((member, index) => {
                if (index != members.length - 1) pairs.set(members[index], members[index + 1]);
                else pairs.set(members[index], members[0]);
            });

        } else {
            message.channel.send('Avaliable commands: draw');
        }
	},
};