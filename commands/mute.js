module.exports = {
	name: 'mute',
    description: 'Converts all messages from a user to "bonk".',
    guildOnly: false,
    args: true,
    aliases: [''],
	usage: '<user>',
	cooldown: 0,
	execute(message) {
        /* if (!message.member.hasPermission('MUTE_MEMBERS')) {
            message.channel.send('You don\'t have permission to use this command!');
            return;
        } */
        
        if (!message.mentions.members.size) {
            message.channel.send('You didn\'t tag a user to mute!');
            return;
        }

        const muteRole = message.guild.roles.cache.find(r => r.name === 'bonk-mute');

        message.mentions.members.each(member => {
            if (member.roles.cache.some(role => role.name === 'bonk-mute')) {
                member.roles.remove(muteRole);
                message.channel.send(`Unmuted ${member.user}`);
                console.log(`Unmuted ${member.user.username}`);
            } else {
                member.roles.add(muteRole);
                message.channel.send(`Muted ${member.user}`);
                console.log(`Muted ${member.user.username}`);
            }
        });
	},
};