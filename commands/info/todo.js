const { Command } = require('discord.js-commando');
const { Todos } = require('../../util/dbObjects');
const { stripIndents } = require('common-tags');

module.exports = class TodoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'todo',
            group: 'info',
            memberName: 'todo',
            description: 'Todo list manager for the Bonk Bot project.',
            args: [
                {
                    key: 'command',
                    prompt: 'What todo action do you want to execute?',
                    type: 'string',
                    default: '',
                },
                {
                    key: 'args',
                    prompt: 'What is the argument for the command?',
                    type: 'string',
                    default: '',
                }
            ],
        });
    }

    async run(message, { command, args }) {
        if (command === 'list' || command == 'ls') {
            const todoList = await Todos.findAll();
            let formattedList = '';

            todoList.forEach(t => {
                formattedList += `\*\*#\*\* ${t.task}\n`;
            });

            message.say(stripIndents`
               \*\*Bonk Bot Project Todo List:\*\*
                ${formattedList}
            `);
        } else if (command === 'add' || command === 'create') {
            try {
                await Todos.create({
                    task: args,
                });
                return message.say(`Todo list updated!`);
            } catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return message.say('That task is already in the todo list.');
                }
                return message.say('An error occured when adding a task.');
            }
        } else if (command === 'remove' || command === 'rm') {
            const todoList = await Todos.findAll();
            let formattedList = '';

            todoList.forEach((t, i) => {
                formattedList += `[${i + 1}] ${t.task}\n`; 
            });

            let choice;
            const list = await message.say(stripIndents`
                \*\*Which task do you want to remove?\*\*
                ${formattedList}
            `);

            try {
                choice = await message.channel.awaitMessages(
                    m => m.author.id === message.author.id,
                    {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    },
                );
            } catch (err) {
                list.delete();
                message.say('You didn\'t specify a choice');
            }

            list.delete();
            choice = parseInt(choice.first().content);

            if (!choice || choice > todoList.length) {
                return message.say('You didn\'t specify a valid choice');
            } else {
                choice = todoList[choice - 1].task;
            }

            const rowCount = await Todos.destroy({ where: { task: choice } });
            if (!rowCount) return message.say('That task does not exist.');

            return message.say(`Task deleted.`);
        }
    }
};