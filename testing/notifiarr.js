/*
    https://discord.js.org/#/docs/main/stable/class/Client
*/

import * as fs from 'fs';
import fetch from 'node-fetch';

let config				= fs.readFileSync('config.json', 'utf8').toString();
config					= JSON.parse(config);

const apikey        	= config['userApikey'];
const botToken      	= config['botToken'];

const userIds       	= config['devDiscordUsers']; //-- Use in Notifiarr-Dev bot ONLY... Used to ignore everyone but "Notifiarr" and "nitsua"
const tester        	= config['testing']; //-- Use in Notifiarr-Dev bot ONLY... Used to ignore everyone but "nitsua"
const webhooks      	= config['webhooks']; //-- send webhooks to site
const debug         	= config['debug']; //-- output debug to CLI
const upPing        	= config['upPing']; //-- send better stack / cronitor pings
const scPing        	= config['scPing']; //-- send server count pings

const notifiarr     	= config['notifiarrApiURL'];
const uptimeURL    		= config['betterUptimeURL'];
const cronitorURL     	= config['cronitorURL'];
const uptimeDelay   	= config['uptimeDelay'];
const serverCountDelay 	= config['countDelay'];
let counter         	= 0;
let headers         	= {'Content-Type': 'application/json', 'X-password': config['authProxyPass'], 'X-server': 0};
let data            	= {};

//-- Everything below should match dev and live, use variables above properly!
import {Client, GatewayIntentBits} from 'discord.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

function pingUptime() {
    if (!upPing) {
        return;
    }

    counter++;
	fetch(uptimeURL).then((res) => {
		return res.text();
	}).then((response) => {
        if (debug) {
            console.log('Uptime ping sent, #' + counter + '.');
        }
	});

	fetch(cronitorURL).then((res) => {
		return res.text();
	}).then((response) => {
        if (debug) {
            console.log('Uptime ping sent to Cronitor, #' + counter + '.');
        }
	});
}

function pingServerCount() {
    if (!scPing) {
        return;
    }

	let shards = [];
	client.shard.broadcastEval(client => [client.shard.ids, client.ws.status, client.ws.ping, client.guilds.cache.size]).then((results) => {
		results.map((data) => {
			shards.push({'id': data[0], 'status': data[1], 'ping': data[2], 'guilds': data[3]});
		});
	}).then(() => {
		let shardData = JSON.stringify(shards);

		client.shard.fetchClientValues('guilds.cache.size').then(results => {
			const serverCount = results.reduce((acc, guildCount) => acc + guildCount, 0);

			data = {
				'count': serverCount,
				'shardData': shardData,
				'botToken': botToken
			}

			let headersClone = headers;
			headersClone['X-api-key'] = apikey;
			delete headersClone['X-server'];

			fetch(notifiarr + 'system/serverCount', {
				method: 'POST',
				headers: headersClone,
				body: JSON.stringify(data)
			}).then((res) => {
				return res.text();
			}).then((response) => {
				if (debug) {
					console.log('Server count (' + serverCount + ') ping sent.');
				}
			});
		});
	});
}

function webhook(data) {
    if (!webhooks) {
        if (debug) {
            console.log('webhooks disabled');
        }

        return;
    }

    headers['X-server'] = data['server'];

    const endpoint = (data.event ? 'notification/discordApp' : 'user/keywords');

    fetch(notifiarr + endpoint, {
        method: 'POST', 
        headers: headers, 
        body: JSON.stringify(data)
	});

    if (debug) {
        console.log('webhook sent: ' + (data.event ? data.event : data.mediarequest_eventtype));
    }
}

client.on('ready', () => {
    if (!config['testing']) {
        if (debug) {
            console.log('pingUptime() and pingServerCount() intervals started');
        }

        pingUptime();

        setInterval(function() {
            pingUptime();
        }, (60000 * uptimeDelay));

        setInterval(function() {
            pingServerCount();
        }, (60000 * serverCountDelay));
    }

    if (debug) {
        console.log('client.ready');
    }
});

client.on('interactionCreate', async (interaction) => {
    data = {
        'event': 'interactionCreate',
        'member': interaction.user.id,
        'server': interaction.guildId,
		'channel': interaction.channelId,
		'customId': interaction.customId,
        'botToken': botToken
    }

    if (debug) {
        console.log('client.interactionCreate->' + data['server']);
    }

	await interaction.reply({ content: 'Response sent to Notifiarr!', ephemeral: true });

    webhook(data);
});

client.on('threadCreate', (thread) => {
    data = {
        'event': 'threadCreate',
        'threadParent': thread.parentId,
        'thread': thread.id,
        'member': thread.ownerId,
        'server': thread.guildId,
        'botToken': botToken
    }

    if (debug) {
        console.log('client.threadCreate->' + data['server']);
    }

    webhook(data);
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
        'botToken': botToken
    }

    if (debug) {
        console.log('client.threadUpdate->' + data['server']);
    }

    webhook(data);
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
        'botToken': botToken
    }

    if (debug) {
        console.log('client.threadDelete->' + data['server']);
    }

    webhook(data);
});

client.on('guildBanAdd', (guild, member) => {
    data = {
        'event': 'guildBanAdd',
        'member': JSON.stringify(member),
        'server': guild.id,
        'botToken': botToken
    }

    if (debug) {
        console.log('client.guildBanAdd->' + data['server']);
    }

    webhook(data);
});

client.on('guildBanRemove', (guild, member) => {
    data = {
        'event': 'guildBanRemove',
        'member': JSON.stringify(member),
        'server': guild.id,
        'botToken': botToken
    }

    if (debug) {
        console.log('client.guildBanRemove->' + data['server']);
    }

    webhook(data);
});

client.on('guildMemberRemove', (member) => {
    data = {
        'event': 'guildMemberRemove',
        'memberCount': member.guild.memberCount,
        'member': JSON.stringify(member),
        'server': member.guild.id,
        'botToken': botToken
    }

    if (debug) {
        console.log('client.guildMemberRemove->' + data['server']);
    }

    webhook(data);
});

client.on('guildMemberAdd', (member) => {
    data = {
        'event': 'guildMemberAdd',
        'memberCount': member.guild.memberCount,
        'member': JSON.stringify(member),
        'server': member.guild.id,
        'botToken': botToken
    }

    if (debug) {
        console.log('client.guildMemberAdd->' + data['server']);
    }

    webhook(data);
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    data = {
        'event': 'messageUpdate',
        'newMessage': JSON.stringify(newMessage),
        'oldMessage': JSON.stringify(oldMessage),
        'server': newMessage.guild.id,
        'botToken': botToken,
    }

    if (debug) {
        console.log('client.messageUpdate->' + data['server']);
    }

    webhook(data);
});

client.on('messageDelete', (message) => {
    data = {
        'event': 'deleteMessage',
        'message': JSON.stringify(message),
        'server': message.guild.id,
        'botToken': botToken,
    }

    if (debug) {
        console.log('client.messageDelete->' + data['server']);
    }

    webhook(data);
});

client.on('messageCreate', (message) => {
    //-- tester.js ONLY
    if (tester && !userIds.includes(parseInt(message.author.id))) {
        console.log('Ignoring non allowed user ' + message.author.username + ' (' + message.author.id + ')');
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
                'botToken': botToken,
            }

            if (debug) {
                console.log('client.messageCreate->' + data['server']);
            }

            webhook(data);
        });
    }
});

if (debug) {
    console.log('client.login');
}

client.login(botToken);
