const { userData } = require('../util/dbCollections');

module.exports = {
    name: 'guildMemberUpdate',
    execute(oldMember, newMember) {
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if (removedRoles.size > 0 || addedRoles.size > 0)  {
            userData.updateRoles(newMember.user.id, newMember.guild.id, newMember.roles.cache.map(r => r.id));
        }
    },
};
