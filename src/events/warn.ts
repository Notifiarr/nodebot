import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import type { EventModule } from '../types.d.js';

const event: EventModule<Events.Warn> = {
    name: Events.Warn,
    execute(message) {
        logger.warn(message);
    },
};

export default event;
