module.exports = class Util {
    static async sendWebhookMessage(channel, name, avatarURL, message) {
        const webhooks = await channel.fetchWebhooks();
        const webhook = webhooks.first();

        await webhook.send(message, {
            username: `${name}`,
            avatarURL: `${avatarURL}`,
        }).catch(console.error);
    }
};