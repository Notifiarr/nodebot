import type { Client, ClientEvents } from 'discord.js';
import type { EventModule } from '../types.d.js';
import logger from './logger.js';

export default async function loadEvent(client: Client, eventFile: string, eventsPath: URL) {
    const filePath = new URL(eventFile, eventsPath).href;
    const event = await import(filePath).then((module: { default: EventModule<keyof ClientEvents> }) => module.default);

    if ('name' in event && 'execute' in event) {
        if (event.once) {
            client.once(event.name, (...eventArguments) => event.execute(...eventArguments));
        } else {
            client.on(event.name, (...eventArguments) => event.execute(...eventArguments));
        }
    } else {
        logger.warn(`The event at ${filePath} is missing a required "name" or "execute" property.`);
    }
}
