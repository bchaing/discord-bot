const { userData } = require('../index');

module.exports = {
	name: 'guildMemberAdd',
	execute(GuildMember) {
        const roles = userData.getRoles(GuildMember.user.id, GuildMember.guild.id);
    
        if (roles !== 'no roles') GuildMember.roles.set(roles);
    },
};
