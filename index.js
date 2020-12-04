// require the discord.js module
const fs = require('fs');
const Discord = require('discord.js');

// create a new Discord client
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

// creates an array of commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const cooldowns = new Discord.Collection();

// loops over the commands in the collection
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    client.user.setActivity('b!help', { type: 'COMPETING' });
    console.log(`Logged in as ${client.user.tag}`);
    
    createRoleCache(client.guilds.cache.get('138027449610010625'));
    createVCRoles(client.guilds.cache.get('138027449610010625'));
});

client.login(token);

// listen for messages
client.on('message', message => {
    // checks if the message has the prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // creates variables for the args and commandName
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // creates a command object
    const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;   // returns if command does not exist

    // checks if a command is only for a guild
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    // checks if the number of args is correct
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        // checks if usage exists, and then prints it
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
    }

    // checks the cooldown status of the command
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

let rolePersistCache;

client.on('guildMemberUpdate', (oldMember, newMember) => {
    // If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
	const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
	if (removedRoles.size > 0)  {
        rolePersistCache[newMember.id] = newMember._roles;
        // console.log(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayName}.`);
    }
    // If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
        rolePersistCache[newMember.id] = newMember._roles;
        // console.log(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayName}.`);
    }
});

client.on('guildMemberAdd', GuildMember => {
    GuildMember.roles.set(rolePersistCache[GuildMember.id]).catch(console.error);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    const updatedUser = oldState.member;

    // remove vc role when leaving channel
    if (newState.channel != oldState.channel && oldState.channel != null) {
        updatedUser.roles.remove(newState.guild.roles.cache.find(r => r.name === '━━━━━━ Voice ━━━━━━')).catch(console.error);
        updatedUser.roles.remove(newState.guild.roles.cache.find(r => r.name === `${oldState.channel.name}`)).catch(console.error);
    }

    // add vc role when joining channel
    if (newState.channel != oldState.channel && newState.channel != null) {
        updatedUser.roles.add(newState.guild.roles.cache.find(r => r.name === '━━━━━━ Voice ━━━━━━')).catch(console.error);
        updatedUser.roles.add(newState.guild.roles.cache.find(r => r.name === `${newState.channel.name}`)).catch(console.error);
    } 
});

client.on('channelUpdate', (oldChannel, newChannel) => {
    if (oldChannel.name != newChannel.name) {
        const VCRole = newChannel.guild.roles.cache.find(r => r.name === `${oldChannel.name}`);
        VCRole.edit({ name: `${newChannel.name}` });
    }
});

client.on('channelCreate', channel => {
    if (channel.type == "voice") {
        channel.guild.roles.create({
            data: {
                name: `${channel.name}`,
                mentionable: true,
            },
        });
    }
});

async function createRoleCache(guild) {
    rolePersistCache = await guild.members.fetch();     // get guild role cache
    fs.writeFileSync('modules/rolepersist.json', JSON.stringify(rolePersistCache), 'utf-8');
}

function createVCRoles(guild) {
    const voiceChannels = guild.channels.cache;         // get guild channel cache
    let role;                                           // declare role variable
    
    // loop through all channels of a guild
    for (const [key, value] of voiceChannels) {
        // check if channel is a voice channel
        if (value.type == "voice") {
            role = guild.roles.cache.find(r => r.name === `${value.name}`);
            if (!role) {    // check if role exists for each vc
                guild.roles.create({
                    data: {
                      name: `${value.name}`,
                      mentionable: true,
                    },
                });
            } else if (!role.mentionable) {     // make sure each voice channel role is mentionable
                role.edit({ mentionable: true }).catch(console.error);
            }
        }
    }
}