const { Users } = require('../util/dbObjects');
const { userData } = require('../util/dbCollections');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
    
        client.user.setActivity('b!help', { type: 'COMPETING' });
        
        const allUsers = await Users.findAll();
        allUsers.forEach(r => userData.set(r.id, r));
    },
};
