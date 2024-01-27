import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.InteractionCreate> = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const webhookTimestamp = Date.now();
        logger.verbose(
            `shard ${interaction.guild?.shardId} #${webhookTimestamp}: ${this.name}->${interaction.guild?.id}`,
        );
        try {
            await notifiarrWebhook(
                {
                    event: this.name,
                    botToken: interaction.client.token,
                    server: interaction.guild?.id,
                    member: interaction.user.id,
                    channel: interaction.channel?.id,
                    customId: interaction.isMessageComponent() ? interaction.customId : undefined,
                },
                interaction.guild?.shardId,
                webhookTimestamp,
            );
        } catch (error) {
            logger.error('caught:', error);
        }

        if (interaction.isMessageComponent()) {
            // Handle message components
        }
    },
};

export default event;
