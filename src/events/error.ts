import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import type { EventModule } from '../types.d.js';

const event: EventModule<Events.Error> = {
    name: Events.Error,
    execute(message) {
        logger.error(message);
    },
};

export default event;
