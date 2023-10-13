import { REST, Routes, type ApplicationCommand, type Client } from 'discord.js';
import logger from './logger.js';

export default async function registerSlashCommands(client: Client) {
    if (!client.user) {
        logger.warn('Not logged in.');
        return;
    }

    const slashCommands = client.slashCommands.map((slashCommand) => slashCommand.data.toJSON());

    const rest = new REST().setToken(client.token ?? '');
    logger.info(`Started refreshing ${slashCommands.length} application (/) commands.`);

    const existingCommands = (await rest.get(Routes.applicationCommands(client.user.id))) as
        | ApplicationCommand[]
        | undefined;
    if (Array.isArray(existingCommands)) {
        const results = [];

        for (const existingCommand of existingCommands) {
            if (existingCommand.id && existingCommand.name && !client.slashCommands.get(existingCommand.name)) {
                results.push(rest.delete(Routes.applicationCommand(client.user.id, existingCommand.id)));
                logger.info(`Deleting unavailable ${existingCommand.name} application command.`);
            }
        }

        await Promise.all(results);

        logger.info(`Successfully deleted ${results.length} unavailable application commands.`);
    } else {
        await rest.put(Routes.applicationCommands(client.user.id), { body: [] });
        logger.info('Successfully deleted all application commands.');
    }

    const data = await rest.put(Routes.applicationCommands(client.user.id), {
        body: slashCommands,
    });
    if (Array.isArray(data) && data.length > 0) {
        logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
    }
}
