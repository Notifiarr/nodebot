import config from '../config.js';
import logger from './logger.js';

export default async function notifiarrWebhook(
    data: Record<string, string | string[] | number | boolean | undefined>,
    shard: number | undefined,
    request: number,
) {
    if (!config.webhooks) {
        logger.info('webhooks disabled');
        return;
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('X-api-key', config.userApiKey);
    headers.set('X-server', String(data.server));

    logger.info('building webhook payload...');

    const endpoint = data.event ? 'notification/discordApp' : 'user/keywords';
    try {
        const response = await fetch(config.notifiarrApiUrl + endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        if (response.ok) {
            logger.info(`shard ${shard}: webhook sent->/${endpoint}`);
            logger.http(await response.text());
        } else {
            logger.error(`shard ${shard}: webhook failed->/${endpoint}`);
            logger.http(await response.text());
        }
    } catch (error) {
        logger.error('caught:', error);
    }
}
