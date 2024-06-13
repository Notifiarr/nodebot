import { Events } from 'discord.js';
import config from '../config.js';
import logger from '../functions/logger.js';
import pingServerCount from '../functions/pingServerCount.js';
import pingUptime from '../functions/pingUptime.js';
import type { EventModule } from '../types.d.js';

const event: EventModule<Events.ClientReady> = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        logger.info(`Ready! Logged in as ${client.user.tag}`);

        if (!config.testing) {
            logger.verbose('pingUptime() and pingServerCount() intervals started');

            let upCounter = 1;
            await pingUptime(upCounter);

            setInterval(async () => {
                upCounter++;
                await pingUptime(upCounter);
            }, 60_000 * config.uptimeDelay);

            setInterval(async () => {
                await pingServerCount(client);
            }, 60_000 * config.countDelay);
        }
    },
};

export default event;
