/* module.exports = {
	name: 'channelUpdate',
	execute(oldChannel, newChannel) {
        // change name of vc role when vc is updated
        if (oldChannel.type === 'voice' && oldChannel.name !== newChannel.name) {
            const VCRole = newChannel.guild.roles.cache.find(r => r.name === `${oldChannel.name}`);
            VCRole.edit({ name: `${newChannel.name}` });
        }
    },
}; */