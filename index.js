// discord.js-command module
const { CommandoClient } = require('discord.js-commando');
const { Collection } = require('discord.js');
const { prefix, token, ownerID } = require('./config.json');
const path = require('path');
const fs = require('fs');

const { Users } = require('./util/dbObjects');
const userData = new Collection();
module.exports = { userData };

// console timestamps
require('console-stamp')(console, { pattern: 'm/dd/yy HH:MM:ss', label: false, colors: { stamp: 'green' } });

// create command clientnpm in
const client = new CommandoClient({
	commandPrefix: prefix,
    owner: ownerID,
});

// register the command groups, args types, and default comm
client.registry
	.registerDefaultTypes()
	.registerGroups([
        ['currency', 'Currency'],
        ['fun', 'Fun'],
        ['general', 'General'],
        ['info', 'Info'],
        ['voice', 'Voice'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
        help: false,
        ping: false,
    })
	.registerCommandsIn(path.join(__dirname, 'commands'));

// prevent commands from executing for muted users
client.dispatcher.addInhibitor(msg => {
    if(msg.member.roles.cache.some(r => r.name === 'bonk-mute')) return 'bonked';
});
  
Reflect.defineProperty(userData, 'updateRoles', {
    value: async function updateRoles(user_id, guild_id, role_ids) {
            const id = `${guild_id}-${user_id}`;    
            const user = userData.get(id);
            if (user) {
                user.roles = role_ids;
                return user.save();
            }
            const newUser = await Users.create({ 
                id: id,
                user_id: user_id, 
                guild_id: guild_id,
                roles: role_ids,
            });
            userData.set(id, newUser); 
            return newUser;
        },
});

Reflect.defineProperty(userData, 'getRoles', {
    value: function getRoles(user_id, guild_id) {
        const id = `${guild_id}-${user_id}`;
        const user = userData.get(id);
        return user ? user.roles : 'no roles';
    },
});

Reflect.defineProperty(userData, 'addBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: async function addBalance(user_id, guild_id, amount) {
        const id = `${guild_id}-${user_id}`;
        const user = userData.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ 
            id: id,
            user_id: user_id, 
            guild_id: guild_id,
            balance: amount,
        });
		userData.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(userData, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(user_id, guild_id) {
        const id = `${guild_id}-${user_id}`;
		const user = userData.get(id);
		return user ? user.balance : 0;
	},
});

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.on('error', console.error);

client.login(token);

client.on('voiceStateUpdate', async (oldState, newState) => {
    /* const updatedUser = oldState.member;

    // remove vc role when leaving channel
    if (newState.channel != oldState.channel && oldState.channel != null) {
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
    } */ 
});

client.on('channelUpdate', (oldChannel, newChannel) => {
    /* // change name of vc role when vc is updated
    if (oldChannel.type === 'voice' && oldChannel.name !== newChannel.name) {
        const VCRole = newChannel.guild.roles.cache.find(r => r.name === `${oldChannel.name}`);
        VCRole.edit({ name: `${newChannel.name}` });
    } */
});

client.on('channelCreate', channel => {
    /* // create new role for newly created vc's
    if (channel.type === 'voice') {
        channel.guild.roles.create({
            data: {
                name: `${channel.name}`,
                mentionable: true,
            },
        });
    } */
});

client.on('channelDelete', channel => {
    /* // delete vc roles on vc deletion
    if (channel.type === 'voice') {
        const role = channel.guild.roles.cache.find(r => r.name === `${channel.name}`);
        role.delete();
    } */
});