import config from '../config.js';
import logger from './logger.js';

export default function startup() {
    logger.info('----- config.json start -----');
    logger.info(`botToken: ${Boolean(config.botToken)}`);
    logger.info(`userApiKey: ${Boolean(config.userApiKey)}`);
    logger.info(`devDiscordUsers: ${config.devDiscordUsers.length > 0}`);

    logger.info(`notifiarrApiUrl: ${Boolean(config.notifiarrApiUrl)}`);
    logger.info(`betterUptimeUrl: ${Boolean(config.betterUptimeUrl)}`);
    logger.info(`cronitorUrl: ${Boolean(config.cronitorUrl)}`);

    logger.info(`webhooks: ${config.webhooks}`);
    logger.info(`testing: ${config.testing}`);
    logger.info(`logLevel: ${config.logLevel}`);
    logger.info(`logPath: ${config.logPath}`);
    logger.info(`upPing: ${config.upPing}`);
    logger.info(`scPing: ${config.scPing}`);
    logger.info(`uptimeDelay: ${config.uptimeDelay}`);
    logger.info(`countDelay: ${config.countDelay}`);
    logger.info('----- config.json end -----');

    if (config.botToken.length === 0) {
        throw new Error('CRITICAL ERROR: Config is missing a bot token, it is required');
    }

    if (config.userApiKey.length === 0) {
        throw new Error('CRITICAL ERROR: Config is missing a user apikey, it is required');
    }

    if (config.upPing && config.betterUptimeUrl.length === 0 && config.cronitorUrl.length === 0) {
        throw new Error('CRITICAL ERROR: Betteruptime or Cronitor url is required when upPing is enabled');
    }
}
