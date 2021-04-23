/* module.exports = {
	name: 'voiceStateUpdate',
	async execute(newState, oldState) {
        const updatedUser = oldState.member;

        // remove vc role when leaving channel
        if (newState.channel != oldStatechannel && oldState.channel != null) {
            updatedUser.roles.remove(newState.guild.roles.cache.find(r => r.name === `${oldState.channel.name}`)).catch(console.error);
            updatedUser.roles.remove(newState.guild.roles.cache.find(r => r.name === '━━━━━━ Voice ━━━━━━')).catch(console.error);
        }

        // add vc role when joining channel
        if (newState.channel != oldState.channel && newState.channel != null) {

            // create role if it doesn't yet exist
            let voiceChannelRole = newState.guild.roles.cache.find(r => r.name === `${newState.channel.name}`);
        
            if (!voiceChannelRole) {
                voiceChannelRole = await newState.guild.roles.create({
                    data: {
                    name: `${newState.channel.name}`,
                    mentionable: true,
                    },
                });
            } else if (!voiceChannelRole.mentionable) {
                voiceChannelRole.edit({ mentionable: true }).catch(console.error);
            }

            updatedUser.roles.add(newState.guild.roles.cache.find(r => r.name === '━━━━━━ Voice ━━━━━━')).catch(console.error);
            updatedUser.roles.add(voiceChannelRole).catch(console.error);
        }
    },
}; */
