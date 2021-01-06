// discord.js-command module
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { prefix, token, serverID, ownerID } = require('./config.json');
const { sendWebhookMessage } = require('./util/Util');

let rolePersistCache;

// console timestamps
require('console-stamp')(console, { pattern: 'm/dd/yy HH:MM:ss', label: false, colors: { stamp: 'green' } });

// create command client
const client = new CommandoClient({
	commandPrefix: prefix,
    owner: ownerID,
});

// register the command groups, args types, and default comm
client.registry
	.registerDefaultTypes()
	.registerGroups([
        ['general', 'General'],
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
  
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    client.user.setActivity('b!help', { type: 'COMPETING' });
    
    createRoleCache(client.guilds.cache.get(serverID));
});

client.on('error', console.error);

client.login(token);

// listen for messages
client.on('message', message => {
    // check if message has a broken @
    if (message.content.includes('<<@&')) {
        const returnMsg = message.content.replace(/<@&773265799875919912>/g, '@');
        message.delete();

        sendWebhookMessage(message.channel, message.member.displayName, message.author.avatarURL(), returnMsg);
    }

    //
    //  code for bonk-mute
    // 
    if (message.member === null) return;

    if (message.member.roles.cache.some(role => role.name === 'bonk-mute')) {
        message.delete();
        
        let returnMessage;
        if (message.embeds.size === undefined) {
            returnMessage = message.content.replace(/([^\s]+)/g, 'bonk');
            console.log(`Muted message from ${message.member.user.username}: ${message.content || '[attachment]'}`);
        } else {
            returnMessage = 'bonk '.repeat(message.embeds.size);
            console.log(`Muted message from ${message.member.user.username}: [embed]`);
        }
        
        sendWebhookMessage(message.channel, message.member.displayName, message.author.avatarURL(), returnMessage || 'bonk');
    }
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    // If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
	const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
	if (removedRoles.size > 0)  {
        rolePersistCache[newMember.id] = newMember._roles;
    }
    // If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
        rolePersistCache[newMember.id] = newMember._roles;
    }
});

client.on('guildMemberAdd', GuildMember => {
    // set new member's roles to what is stored in the cache
    GuildMember.roles.set(rolePersistCache[GuildMember.id]).catch(console.error);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const updatedUser = oldState.member;

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
    } 
});

client.on('channelUpdate', (oldChannel, newChannel) => {
    // change name of vc role when vc is updated
    if (oldChannel.type === 'voice' && oldChannel.name !== newChannel.name) {
        const VCRole = newChannel.guild.roles.cache.find(r => r.name === `${oldChannel.name}`);
        VCRole.edit({ name: `${newChannel.name}` });
    }
});

client.on('channelCreate', channel => {
    // create new role for newly created vc's
    if (channel.type === 'voice') {
        channel.guild.roles.create({
            data: {
                name: `${channel.name}`,
                mentionable: true,
            },
        });
    }
});

client.on('channelDelete', channel => {
    // delete vc roles on vc deletion
    if (channel.type === 'voice') {
        const role = channel.guild.roles.cache.find(r => r.name === `${channel.name}`);
        role.delete();
    }
});

async function createRoleCache(guild) {
    rolePersistCache = await guild.members.fetch();
}