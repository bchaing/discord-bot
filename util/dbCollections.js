const { Users } = require("./dbObjects");
const { Collection } = require("discord.js");

const userData = new Collection();

Reflect.defineProperty(userData, "updateRoles", {
  value: async function updateRoles(user_id, guild_id, role_ids) {
    const id = `${guild_id}-${user_id}`;
    const user = userData.get(id);
    if (user) {
      user.roles = role_ids;
      return user.save();
    }
    const newUser = await Users.create({
      id: id,
      user_id: user_id,
      guild_id: guild_id,
      roles: role_ids,
    });
    userData.set(id, newUser);
    return newUser;
  },
});

Reflect.defineProperty(userData, "getRoles", {
  value: function getRoles(user_id, guild_id) {
    const id = `${guild_id}-${user_id}`;
    const user = userData.get(id);
    return user ? user.roles : "no roles";
  },
});

Reflect.defineProperty(userData, "addBalance", {
  /* eslint-disable-next-line func-name-matching */
  value: async function addBalance(user_id, guild_id, amount) {
    const id = `${guild_id}-${user_id}`;
    const user = userData.get(id);
    if (user) {
      user.balance += Number(amount);
      return user.save();
    }
    const newUser = await Users.create({
      id: id,
      user_id: user_id,
      guild_id: guild_id,
      balance: amount,
    });
    userData.set(id, newUser);
    return newUser;
  },
});

Reflect.defineProperty(userData, "getBalance", {
  /* eslint-disable-next-line func-name-matching */
  value: function getBalance(user_id, guild_id) {
    const id = `${guild_id}-${user_id}`;
    const user = userData.get(id);
    return user ? user.balance : 0;
  },
});

module.exports = { userData };
