/* module.exports = {
	name: 'channelCreate',
	execute(channel) {
        // create new role for newly created vc's
        if (channel.type === 'voice') {
            channel.guild.roles.create({
                data: {
                    name: `${channel.name}`,
                    mentionable: true,
                },
            });
        } 
    },
}; */