// discord.js-command module
const { CommandoClient } = require('discord.js-commando');
const { Collection } = require('discord.js');
const { prefix, token, ownerID, redditClientId, redditSecret, redditToken } = require('./config.json');
const { sendWebhookMessage, isURL } = require('./util/Util');
const fetch = require('node-fetch');
const snoowrap = require('snoowrap');
const path = require('path');

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

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    client.user.setActivity('b!help', { type: 'COMPETING' });
    
    const allUsers = await Users.findAll();
    allUsers.forEach(r => userData.set(r.id, r));
});

client.on('error', console.error);

client.login(token);

// listen for messages
client.on('message', async message => {
    // check if message has a broken @
    if (message.content.includes('<<@&')) {
        const returnMsg = message.content.replace(/<@&773265799875919912>/g, '@');
        message.delete();

        sendWebhookMessage(message.channel, message.member.displayName, message.author.avatarURL(), returnMsg);
    }

    //  code for bonk-mute
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

    // reddit embeds
    if (isURL(message.content) && message.content.includes("reddit")) {
        const submissionid = message.content.split('/')[6];

        const r = new snoowrap({
            userAgent: 'A random string.',
            clientId: redditClientId,
            clientSecret: redditSecret,
            refreshToken: redditToken,
        });

        const submission = await (await r.getSubmission(submissionid)).fetch().url.catch();
        
        const embedSites = [/i.redd.it/, /i.imgur.com/, /clips.twitch.tv/,
            /streamable.com/, /youtube.com/, /gfycat.com/];
        
        if (embedSites.some(site => site.test(submission))) {
            message.say(submission);
        } else if (/v.redd.it/.test(submission)) {
            const id = submission.split('/')[3];

            for (let i = 0; i < 2; i++) {
                const apiURL = `https://vred.rip/api/vreddit/${id}`;
                
                let resp, json;
                try {
                    resp = await fetch(apiURL);
                    json = await resp.json();
                } catch {
                    continue;
                }

                message.say(json.video_url);
                break;
            }
        }
    } else if (isURL(message.content) && message.content.includes("v.redd.it")) {
        const id = message.content.split('/')[3];
        
        for (let i = 0; i < 2; i++) {
            const apiURL = `https://vred.rip/api/vreddit/${id}`;
            
            let resp, json;
            try {
                resp = await fetch(apiURL);
                json = await resp.json();
            } catch {
                continue;
            }

            message.say(json.video_url);
            break;
        }
    }
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
	const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
	if (removedRoles.size > 0 || addedRoles.size > 0)  {
        userData.updateRoles(newMember.user.id, newMember.guild.id, newMember.roles.cache.map(r => r.id));
    }
});

client.on('guildMemberAdd', GuildMember => {
    const roles = userData.getRoles(GuildMember.user.id, GuildMember.guild.id);
    
    if (roles !== 'no roles') GuildMember.roles.set(roles);
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