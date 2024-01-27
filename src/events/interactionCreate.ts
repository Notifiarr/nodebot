import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.InteractionCreate> = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        logger.info(`${this.name}->${interaction.guild?.id}`);
        try {
            await notifiarrWebhook({
                event: this.name,
                botToken: interaction.client.token,
                server: interaction.guild?.id,
                member: interaction.user.id,
                channel: interaction.channel?.id,
                customId: interaction.isMessageComponent() ? interaction.customId : undefined,
            });
        } catch (error) {
            logger.error('caught:', error);
        }

        if (interaction.isMessageComponent()) {
            // Handle message components
        }
    },
};

export default event;
