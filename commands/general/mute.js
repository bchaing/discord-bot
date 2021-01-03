module.exports = {
	name: 'mute',
    description: 'Converts all messages from a user to "bonk".',
    guildOnly: true,
    args: true,
	usage: '<user>',
	cooldown: 0,
	execute(message) {
        if (!message.mentions.members.size) {
        // check if caller tagged a user to mute
            message.channel.send('You didn\'t tag a user to mute!');
            return;
        }

        // search for mute role
        const muteRole = message.guild.roles.cache.find(r => r.name === 'bonk-mute');

        // check if mute role exists
        if (!muteRole) {
            console.error('The bonk-mute role could not be found. Please restart the bot to create one.');
            message.channel.send('There was an error when trying to mute the user.');
            return;
        }

        // iterate through tagged members and toggle mute role
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