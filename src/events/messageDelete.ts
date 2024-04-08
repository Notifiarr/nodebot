import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.MessageDelete> = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.author?.bot) {
            logger.verbose('skipping delete webhook, bot message');
            return;
        }

        if (!message.inGuild()) {
            logger.verbose('skipping delete webhoo, message is not in a guild');
            return;
        }

        const webhookTimestamp = Date.now();
        logger.verbose(`shard ${message.guild.shardId} #${webhookTimestamp}: ${this.name}->${message.guild.id}`);
        try {
            await notifiarrWebhook(
                {
                    event: this.name,
                    botToken: message.client.token,
                    server: message.guild?.id,
                    message: JSON.stringify(message),
                },
                message.guild.shardId,
                webhookTimestamp,
            );
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
