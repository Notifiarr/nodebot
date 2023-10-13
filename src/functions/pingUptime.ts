import config from '../config.js';
import logger from './logger.js';

export default async function pingUptime(counter: number) {
    if (!config.upPing) {
        logger.info('Uptime ping skipped, upPing = false');
        return;
    }

    if (config.betterUptimeUrl.length === 0) {
        logger.info('Better uptime ping skipped, betterUptimeUrl = empty');
    } else {
        try {
            const response = await fetch(config.betterUptimeUrl);
            if (response.ok) {
                logger.info(`Better uptime ping sent: #${counter}`);
                logger.http(await response.text());
            } else {
                logger.error(`Better uptime ping failed: #${counter}`);
                logger.http(await response.text());
            }
        } catch (error) {
            logger.error('caught:', error);
        }
    }

    if (config.cronitorUrl.length === 0) {
        logger.info('Cronitor ping skipped, cronitorUrl = empty');
    } else {
        try {
            const response = await fetch(config.cronitorUrl);
            if (response.ok) {
                logger.info(`Cronitor ping sent: #${counter}`);
                logger.http(await response.text());
            } else {
                logger.error(`Cronitor ping failed: #${counter}`);
                logger.http(await response.text());
            }
        } catch (error) {
            logger.error('caught:', error);
        }
    }
}
