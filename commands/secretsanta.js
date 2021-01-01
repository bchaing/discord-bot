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

        let temp, retString = '\*\*Test pairings:\*\*\n', j, i = members.length;

        while (i) {
            j = Math.floor(Math.random() * i--);

            temp = members[i];
            members[i] = members[j];
            members[j] = temp;
        }

        members.forEach((member, index) => {
            if (index != members.length - 1) retString = `${retString}${members[index]} -> ${members[index + 1]} \n`;
            else retString = `${retString}${members[index]} -> ${members[0]}`;
        });

        message.channel.send(retString);
        } else {
            message.channel.send('Avaliable commands: draw');
        }
	},
};