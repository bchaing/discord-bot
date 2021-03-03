module.exports = class Util {
    static async sendWebhookMessage(channel, name, avatarURL, message) {
        const webhooks = await channel.fetchWebhooks();
        const webhook = webhooks.first();

        await webhook.send(message, {
            username: `${name}`,
            avatarURL: `${avatarURL}`,
        }).catch(console.error);
    }

    static progressBar(curr, total) {
        const elements = `${'0'.repeat(curr)}${'-'.repeat(total - curr)}`;
        return `[${elements}]`;
    }

    static isURL(str) {
        const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        const url = new RegExp(urlRegex, 'i');
        return str.length < 2083 && url.test(str);
    }
};