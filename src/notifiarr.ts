import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'node:fs';
import config from './config.js';
import loadEvent from './functions/loadEvent.js';
import loadSlashCommand from './functions/loadSlashCommand.js';
import logger from './functions/logger.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.cooldowns = new Collection();
client.slashCommands = new Collection();

try {
    const loaders = [];

    const slashCommandsPath = new URL('slashCommands/', import.meta.url);
    const slashCommandFiles = readdirSync(slashCommandsPath).filter((file) => file.endsWith('.js'));
    for (const slashCommandFile of slashCommandFiles) {
        loaders.push(loadSlashCommand(client, slashCommandFile, slashCommandsPath));
    }

    const eventsPath = new URL('events/', import.meta.url);
    const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
    for (const eventFile of eventFiles) {
        loaders.push(loadEvent(client, eventFile, eventsPath));
    }

    await Promise.all(loaders);
    await client.login(config.botToken);
} catch (error) {
    logger.error('caught:', error);
}

export default client;
