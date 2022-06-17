const { SapphireClient } = require("@sapphire/framework");
const dotenv = require("dotenv");

// init client instance
const client = new SapphireClient({
  intents: ["GUILDS", "GUILD_MESSAGES"],
  loadMessageCommandListeners: true,
  presence: {
    status: "online",
    activities: [{ type: "WATCHING", name: "for commands!" }],
  },
});

// load env variables
dotenv.config();

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.login(process.env.DISCORD_TOKEN).catch(console.error);
