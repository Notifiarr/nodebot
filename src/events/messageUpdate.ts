import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.MessageUpdate> = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (newMessage.author?.bot) {
            return;
        }

        if (!newMessage.inGuild()) {
            return;
        }

        logger.info(`${this.name}->${newMessage.guild.id}`);
        try {
            await notifiarrWebhook({
                event: this.name,
                botToken: newMessage.client.token,
                server: newMessage.guild.id,
                newMessage: JSON.stringify(newMessage),
                oldMessage: JSON.stringify(oldMessage),
            });
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
