module.exports = {
	name: 'avatar',
	description: 'Retrieves the profile picture of a user.',
	aliases: ['av', 'icon', 'pfp'],
	usage: '<user>, <user>, ...',
	cooldown: 0,
	execute(message, args) {
        let taggedMember = message.mentions.members;

        if (taggedMember.size) {
            taggedMember.each((member) => { 
                message.channel.send({ files: [member.user.displayAvatarURL({ dynamic : true })] });
            });
        } else {
            args = args.toString().split(',,').map(elem => elem.replace(/,/g, ' ').trim());
            args.forEach(arg => {
                taggedMember = message.guild.members.cache.find(m => m.user.username.toLowerCase() === arg.toLowerCase());

                if (taggedMember === undefined) {
                    taggedMember = message.guild.members.cache.find(m => String(m.nickname).toLowerCase() === arg.toLowerCase());
                }

                if (taggedMember != undefined) message.channel.send({ files: [taggedMember.user.displayAvatarURL({ dynamic : true })] });
            });
        }

        if (taggedMember === undefined) message.channel.send('Cannot find user!');
	},
};