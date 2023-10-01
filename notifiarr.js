/*
    https://discord.js.org/#/docs/main/stable/class/Client
*/

import * as fn from './functions.js';
import * as fs from 'fs';
import {Client, GatewayIntentBits} from 'discord.js';

const config    = JSON.parse(fs.readFileSync('/config/config.json', 'utf8').toString());
let headers     = {'Content-Type': 'application/json', 'X-api-key': config['userApikey'], 'X-server': 0};
let data        = {};
let upCounter   = 1;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.on('ready', () => {
    if (!config['testing']) {
        fn.log('pingUptime() and pingServerCount() intervals started');

        fn.pingUptime(upCounter);

        setInterval(function() {
            upCounter++;
            fn.pingUptime(upCounter);
        }, (60000 * config['uptimeDelay']));

        setInterval(function() {
            fn.pingServerCount(client, headers);
        }, (60000 * config['countDelay']));
    }
    fn.log('client.ready');
});

client.on('interactionCreate', async (interaction) => {
    data = {
        'event': 'interactionCreate',
        'member': interaction.user.id,
        'server': interaction.guildId,
		'channel': interaction.channelId,
		'customId': interaction.customId,
        'botToken': config['botToken']
    }

    fn.log('client.interactionCreate->' + data['server']);

	await interaction.reply({ content: 'Response sent to Notifiarr!', ephemeral: true });

    fn.webhook(data, headers);
});

client.on('threadCreate', (thread) => {
    data = {
        'event': 'threadCreate',
        'threadParent': thread.parentId,
        'thread': thread.id,
        'member': thread.ownerId,
        'server': thread.guildId,
        'botToken': config['botToken']
    }

    fn.log('client.threadCreate->' + data['server']);
    fn.webhook(data, headers);
});

client.on('threadUpdate', (thread) => {
    data = {
        'event': 'threadUpdate',
        'threadName': thread.name,
        'threadArchived': thread.archived,
        'threadParent': thread.parentId,
        'thread': thread.id,
        'messageCount': thread.messageCount,
        'memberCount': thread.memberCount,
        'member': thread.ownerId,
        'server': thread.guildId,
        'botToken': config['botToken']
    }

    fn.log('client.threadUpdate->' + data['server']);
    fn.webhook(data, headers);
});

client.on('threadDelete', (thread) => {
    data = {
        'event': 'threadDelete',
        'threadName': thread.name,
        'threadArchived': thread.archived,
        'threadParent': thread.parentId,
        'thread': thread.id,
        'messageCount': thread.messageCount,
        'memberCount': thread.memberCount,
        'member': thread.ownerId,
        'server': thread.guildId,
        'botToken': config['botToken']
    }

    fn.log('client.threadDelete->' + data['server']);
    fn.webhook(data, headers);
});

client.on('guildBanAdd', (guild, member) => {
    data = {
        'event': 'guildBanAdd',
        'member': JSON.stringify(member),
        'server': guild.id,
        'botToken': config['botToken']
    }

    fn.log('client.guildBanAdd->' + data['server']);
    fn.webhook(data, headers);
});

client.on('guildBanRemove', (guild, member) => {
    data = {
        'event': 'guildBanRemove',
        'member': JSON.stringify(member),
        'server': guild.id,
        'botToken': config['botToken']
    }

    fn.log('client.guildBanRemove->' + data['server']);
    fn.webhook(data, headers);
});

client.on('guildMemberRemove', (member) => {
    data = {
        'event': 'guildMemberRemove',
        'memberCount': member.guild.memberCount,
        'member': JSON.stringify(member),
        'server': member.guild.id,
        'botToken': config['botToken']
    }

    fn.log('client.guildMemberRemove->' + data['server']);
    fn.webhook(data, headers);
});

client.on('guildMemberAdd', (member) => {
    data = {
        'event': 'guildMemberAdd',
        'memberCount': member.guild.memberCount,
        'member': JSON.stringify(member),
        'server': member.guild.id,
        'botToken': config['botToken']
    }

    fn.log('client.guildMemberAdd->' + data['server']);
    fn.webhook(data, headers);
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    data = {
        'event': 'messageUpdate',
        'newMessage': JSON.stringify(newMessage),
        'oldMessage': JSON.stringify(oldMessage),
        'server': newMessage.guild.id,
        'botToken': config['botToken'],
    }

    fn.log('client.messageUpdate->' + data['server']);
    fn.webhook(data, headers);
});

client.on('messageDelete', (message) => {
    data = {
        'event': 'deleteMessage',
        'message': JSON.stringify(message),
        'server': message.guild.id,
        'botToken': config['botToken'],
    }

    fn.log('client.messageDelete->' + data['server']);
    fn.webhook(data, headers);
});

client.on('messageCreate', (message) => {
    //-- tester.js ONLY
    if (config['testing'] && !config['devDiscordUsers'].includes(parseInt(message.author.id))) {
        fn.log('Ignoring non allowed user ' + message.author.username + ' (' + message.author.id + ')');
        return;
    }

    if (!message.author.bot) {
        message.channel.messages.fetch({before: message.id, limit: 15}).then(messages => {
            data = {
                'mediarequest_eventtype': 'ping',
                'message': JSON.stringify(message),
                'previousMessage': JSON.stringify(messages),
                'channel': message.channel.id,
                'server': message.guild.id,
                'authorRoles': Array.from(message?.member?.roles?.cache?.keys()),
                'botToken': config['botToken'],
            }

            fn.log('client.messageCreate->' + data['server']);
            fn.webhook(data, headers);
        });
    }
});

fn.log('client.login started');
client.login(config['botToken']);
fn.log('client.login complete');
