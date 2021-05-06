// discord.js-command module
const { CommandoClient } = require("discord.js-commando");
const path = require("path");
const fs = require("fs");
const { prefix, token, ownerID } = require("./config.json");

// console timestamps
require("console-stamp")(console, {
  format: ":date(m/dd/yy HH:MM:ss).green",
});

// create commando client
const client = new CommandoClient({
  commandPrefix: prefix,
  owner: ownerID,
});

// register the command groups, args types, and default comm
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["currency", "Currency"],
    ["fun", "Fun"],
    ["general", "General"],
    ["info", "Info"],
    ["voice", "Voice"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: false,
    ping: false,
  })
  .registerCommandsIn(path.join(__dirname, "commands"));

// prevent commands from executing for muted users
client.dispatcher.addInhibitor((msg) => {
  if (msg.member.roles.cache.some((r) => r.name === "bonk-mute")) {
    return "bonked";
  }
});

// event handler
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(token);
