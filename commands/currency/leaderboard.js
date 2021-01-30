const { Command } = require('discord.js-commando');
const { userData } = require('../../index');
const { oneLine } = require('common-tags');

module.exports = class LeaderboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            group: 'currency',
            memberName: 'leaderboard',
            description: 'Displays the leaderboard of user balances.',
            guildOnly: true,
        });
    }

    async run(message) {
        const messages = [];
        const leaderboard = userData.sort((a, b) => b.balance - a.balance)
            .filter(user => message.guild.members.cache.has(user.user_id))
            .filter(user => user.guild_id === message.guild.id)
            .array();
       
        if (!leaderboard) {
            return message.say('All users in the server have 0 bonkus');
        }
      
        const pages = [];

        while (leaderboard.length > 0) {
            pages.push(leaderboard.splice(0, 10));
        }

        let reaction, msg, page, pageNumber = 1;
        const filter = (react, user) => {
            return (react.emoji.name === '⬅️' || react.emoji.name === '➡️')
                && user.id === message.author.id;
        };
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
            page = pages[pageNumber - 1]
                .map((user, position) => oneLine`(${(position + 1) + ((pageNumber - 1) * 10)}) 
                    ${(message.guild.members.cache.get(user.user_id).displayName)}: 
                    ${user.balance} bonkus`)
                .join('\n');

            msg = await message.say(page, { code: true });
            messages.push(msg);

            if (pages[pageNumber - 2]) await msg.react('⬅️');
            if (pages[pageNumber]) await msg.react('➡️');

            try {
                reaction = await msg.awaitReactions(filter,  
                    {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    },
                );
            } catch (error) {
                msg.reactions.removeAll();
                return messages;
            }

            reaction = reaction.firstKey();
            if (reaction === '➡️' && pages[pageNumber]) {
                pageNumber++;
                msg.delete();
            } else if (reaction === '⬅️' && pages[pageNumber - 2]) {
                pageNumber--;
                msg.delete();
            } else {
                msg.delete();
            }
        }
    }
};