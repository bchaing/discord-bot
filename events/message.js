const snoowrap = require('snoowrap');
const fetch = require('node-fetch');
const { isURL, sendWebhookMessage } = require('../util/Util');
const { redditClientId, redditSecret, redditToken } = require('../config.json');

module.exports = {
	name: 'message',
	async execute(message) {
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
            } else {
                returnMessage = 'bonk '.repeat(message.embeds.size);
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
	},
};