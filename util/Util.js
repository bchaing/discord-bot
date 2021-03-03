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
};