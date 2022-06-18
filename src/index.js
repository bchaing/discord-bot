const { SapphireClient } = require("@sapphire/framework");
const dotenv = require("dotenv");

// load env variables
dotenv.config();

// init client instance
const client = new SapphireClient({
  intents: ["GUILDS", "GUILD_MESSAGES"],
  loadMessageCommandListeners: true,
  defaultPrefix: process.env.DEFAULT_PREFIX,
  presence: {
    status: "online",
    activities: [{ type: "WATCHING", name: "for commands!" }],
  },
});

client.login(process.env.DISCORD_TOKEN).catch(console.error);
