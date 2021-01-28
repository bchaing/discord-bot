const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = class RedditCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reddit',
            group: 'general',
            memberName: 'reddit',
            description: 'Displays information on the server.',
            args: [
                {
                    key: 'url',
                    prompt: 'What is the reddit video url?',
                    type: 'string',
                }
            ]
        });
    }

    run(message, { url }) {
        const submissionid = url.split('/')[6];
        const vredditlink = `https://vreddit.cc/${submissionid}`;

        fetch(vredditlink).then(resp => {
            return resp.text();
        }).then(html => {
            const $ = cheerio.load(html);
            let video = $('#vid-container > video:nth-child(1) > source:nth-child(1)').attr('src');
            
            if (video.startsWith('/')) {
                video = `https://vreddit.cc${video}`;
            }
            
            return message.say(video);
        }).catch(err => {
            console.log(err);
            return;
        });
    }
};