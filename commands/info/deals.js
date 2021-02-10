const { Command } = require('discord.js-commando');
const { oneLine, oneLineTrim, stripIndents } = require('common-tags');
const { dealAPIKey } = require('../../config.json');
const fetch = require('node-fetch');

const allowedStores = [
    'steam', 'gog', 'amazonus', 'battlenet', 'discord', 'epic', 'bundlestars', 
    'humblestore', 'indiegalastore', 'microsoft', 'origin', 'squenix', 
    'uplay',
];

module.exports = class DealsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deals',
            aliases: ['isthereanydeals', 'isthereanydeal', 'gamedeals', 'deal'],
            group: 'info',
            memberName: 'deals',
            description: 'Displays information on a game from IsThereAnyDeals.',
            args: [
                {
                    key: 'game',
                    prompt: 'What game do you want to look up?',
                    type: 'string', 
                },
            ],
        });
    }

    async run(message, { game }) {
        if (!dealAPIKey) {
            return message.reply(oneLine`
                The API key has not been set up for this command.
                If you like to use this command, please contact the bot owner.
            `);
        }

        const messages = [], search = [];
        let choice, list;

        let url = oneLineTrim`
            https://api.isthereanydeal.com/v02/search/search/
            ?key=${dealAPIKey}
            &q=${game}
            &limit=10&strict=0
        `;
        let response = await fetch(url);
        let json = await response.json();

        const results = json.data.results;

        results.forEach((value, i) => search.push(`[${i + 1}] ${value.title}`));
        if (search.length !== 0) {
            list = await message.say(stripIndents`
                \*\*Search results for:\*\* ${game}
                ${search.join('\n')}
                \*Respond with the number of the game you want to find\*
            `);
            messages.push(list);
        } else {
            return message.say('No results found.');
        }
        
        try {
            choice = await message.channel.awaitMessages(
                m => m.author.id === message.author.id, 
                {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                },
            );
        } catch (error) {
            list.delete();
            messages.push(message.say(oneLine`
                Cancelling search, you didn't specify a choice in time!
            `));
            return messages;
        }
        
        list.delete();
        choice = parseInt(choice.first().content);

        if (!choice || choice > search.length) {
            return message.say('You didn\'t input a valid number.');
        }

        const gamePlain = json.data.results[choice - 1].plain;

        url = oneLineTrim`
            https://api.isthereanydeal.com/v01/game/overview/
            ?key=${dealAPIKey}
            &region=us&country=US
            &plains=${gamePlain}
            &allowed=${allowedStores.join(',')}
        `;

        response = await fetch(url);
        json = await response.json();
        
        const gameData = json.data[gamePlain];

        try {
            if (gameData.price && gameData.lowest) {
                messages.push(message.say(stripIndents`
                    On sale? ${gameData.price.cut !== 0 ? 'Yes' : 'No'} (${gameData.price.cut}% off)
                    Current Best Price: ${gameData.price.price_formatted} (${gameData.price.store})
                    Link: ${gameData.price.url}

                    Historical Low Price: ${gameData.lowest.price_formatted} (${gameData.lowest.cut}% off) (${gameData.lowest.store})
                    Last seen: ${gameData.lowest.recorded_formatted}
                `));
            } else {
                messages.push(message.say(stripIndents`
                    This game is already free or is unavailable.
                `));
            }
        } catch (err) {
            console.error(err);
            messages.push(message.say(stripIndents`
                An error occurred, please retry in a few seconds.
            `));
            return messages;
        }
        
        return messages;
    }
};