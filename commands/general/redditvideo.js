const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class RedditVideoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'redditvideo',
            group: 'general',
            memberName: 'redditvideo',
            description: 'Embeds reddit videos directly.',
            args: [
                {
                    key: 'url',
                    prompt: 'What is the reddit video url?',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, { url }) {
        let submissionid;
        for (let i = 0; i < 3; i++) {
            const resp = await fetch(url);
            const html = await resp.text();

            const result = html.match(/(v.redd.it\/)(.+)(\/HLS)/gm);

            if (result !== null) {
                submissionid = result[0].split('/')[1];
                break;
            }
        }
        if (!submissionid) {
            return;
        }

        const apiURL = `https://vred.rip/api/vreddit/${submissionid}`;
    
        fetch(apiURL)
            .then(res => res.text())
            .then(async json => {
                const data = await JSON.parse(json);
                return message.say(data.video_url);
            });
    } 
};