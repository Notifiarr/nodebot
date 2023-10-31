import { type Client } from 'discord.js';
import { type SlashCommandModule } from '../types.js';
import logger from './logger.js';

export default async function loadSlashCommand(client: Client, slashCommandFile: string, slashCommandsPath: URL) {
    const filePath = new URL(`${slashCommandFile}?_=${Date.now()}`, slashCommandsPath).href;
    const slashCommand = await import(filePath).then((module: { default: SlashCommandModule }) => module.default);

    if ('data' in slashCommand && 'execute' in slashCommand) {
        client.slashCommands.delete(slashCommand.data.name);
        client.slashCommands.set(slashCommand.data.name, slashCommand);
    } else {
        logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}
