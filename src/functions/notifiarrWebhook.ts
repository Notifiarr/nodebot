import config from '../config.js';
import logger from './logger.js';

export default async function notifiarrWebhook(
    data: Record<string, string | string[] | number | boolean | undefined>,
    shard: number | undefined,
    webhookTimestamp: number,
) {
    if (!config.webhooks) {
        logger.info('webhooks disabled');
        return;
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('X-api-key', config.userApiKey);
    headers.set('X-server', String(data.server));

    logger.debug('building webhook payload...');

    const endpoint = data.event ? 'notification/discordApp' : 'user/keywords';
    try {
        const response = await fetch(config.notifiarrApiUrl + endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        if (response.ok) {
            logger.info(`shard ${shard} #${webhookTimestamp}: webhook sent->/${endpoint}`);
            logger.silly(await response.text());
        } else {
            const error = JSON.parse(await response.text()) as {
                environment: string;
                code: string;
                details: { apikey: string; response: string };
            };
            const errorResponse = JSON.stringify({
                environment: error.environment,
                code: error.code,
                apikey: error.details.apikey,
                error: error.details.response,
            });
            logger.error(`shard ${shard} #${webhookTimestamp}: webhook failed->/${endpoint}`);
            logger.error(errorResponse);
        }
    } catch (error) {
        logger.error('caught:', error);
    }
}
