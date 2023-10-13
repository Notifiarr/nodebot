import config from '../config.js';
import logger from './logger.js';

export default function startup() {
    logger.debug('----- config.json start -----');
    logger.debug(`botToken: ${Boolean(config.botToken)}`);
    logger.debug(`userApiKey: ${Boolean(config.userApiKey)}`);
    logger.debug(`devDiscordUsers: ${config.devDiscordUsers.length > 0}`);

    logger.debug(`notifiarrApiUrl: ${Boolean(config.notifiarrApiUrl)}`);
    logger.debug(`betterUptimeUrl: ${Boolean(config.betterUptimeUrl)}`);
    logger.debug(`cronitorUrl: ${Boolean(config.cronitorUrl)}`);

    logger.debug(`webhooks: ${config.webhooks}`);
    logger.debug(`testing: ${config.testing}`);
    logger.debug(`logLevel: ${config.logLevel}`);
    logger.debug(`logPath: ${config.logPath}`);
    logger.debug(`upPing: ${config.upPing}`);
    logger.debug(`scPing: ${config.scPing}`);
    logger.debug(`uptimeDelay: ${config.uptimeDelay}`);
    logger.debug(`countDelay: ${config.countDelay}`);
    logger.debug('----- config.json end -----');

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
