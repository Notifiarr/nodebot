import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.GuildBanAdd> = {
    name: Events.GuildBanAdd,
    async execute(ban) {
        const webhookTimestamp = Date.now();
        logger.verbose(`shard ${ban.guild.shardId} #${webhookTimestamp}: ${this.name}->${ban.guild.id}`);
        try {
            await notifiarrWebhook(
                {
                    event: this.name,
                    botToken: ban.client.token,
                    server: ban.guild.id,
                    user: JSON.stringify(ban.user),
                },
                ban.guild.shardId,
                webhookTimestamp,
            );
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
