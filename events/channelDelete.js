/* module.exports = {
	name: 'channelDelete',
	execute(channel) {
        // delete vc roles on vc deletion
        if (channel.type === 'voice') {
            const role = channel.guild.roles.cache.find(r => r.name === `${channel.name}`);
            role.delete();
        } 
    },
}; */