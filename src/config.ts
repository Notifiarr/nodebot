import dotenv from 'dotenv';
import fs from 'node:fs';
import process from 'node:process';

let configPath;
if (fs.existsSync('/config')) {
    configPath = fs
        .readdirSync('/config')
        .map((file) => `/config/${file}`)
        .find((file) => file === '/config/.env');
}

dotenv.config({ path: configPath });

const config = {
    botToken: process.env.BOT_TOKEN ?? '',
    userApiKey: process.env.USER_API_KEY ?? '',
    devDiscordUsers: (process.env.DEV_DISCORD_USERS ?? '')
        .split(',')
        .map(Number)
        .filter((item) => item !== 0),

    notifiarrApiUrl: process.env.NOTIFIARR_API_URL ?? '',
    betterUptimeUrl: process.env.BETTER_UPTIME_URL ?? '',
    cronitorUrl: process.env.CRONITOR_URL ?? '',

    webhooks: Boolean(process.env.WEBHOOKS?.toString().toLocaleLowerCase() === 'true'),
    testing: Boolean(process.env.TESTING?.toString().toLocaleLowerCase() === 'true'),
    logLevel:
        ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'].find((level) =>
            new RegExp(`^${process.env.LOG_LEVEL}$`, 'i').exec(level),
        ) ?? 'error',
    logPath: (process.env.LOG_PATH ?? '').length > 0 ? process.env.LOG_PATH : 'logs',
    upPing: Boolean(process.env.UP_PING?.toString().toLocaleLowerCase() === 'true'),
    scPing: Boolean(process.env.SC_PING?.toString().toLocaleLowerCase() === 'true'),
    uptimeDelay: Number(process.env.UPTIME_DELAY ?? 4),
    countDelay: Number(process.env.COUNT_DELAY ?? 10),
};

export default config;
