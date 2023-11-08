import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.MessageDelete> = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.author?.bot) {
            return;
        }

        if (!message.inGuild()) {
            return;
        }

        logger.verbose(`${this.name}->${message.guild.id}`);
        try {
            await notifiarrWebhook({
                event: this.name,
                botToken: message.client.token,
                server: message.guild?.id,
                message: JSON.stringify(message),
            });
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
