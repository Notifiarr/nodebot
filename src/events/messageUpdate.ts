import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import type { EventModule } from '../types.d.js';

const event: EventModule<Events.MessageUpdate> = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (newMessage.author?.bot) {
            return;
        }

        if (!newMessage.inGuild()) {
            return;
        }

        const webhookTimestamp = Date.now();
        logger.verbose(`shard ${newMessage.guild.shardId} #${webhookTimestamp}: ${this.name}->${newMessage.guild.id}`);
        try {
            const attachmentLinks: Array<{ name: string; url: string; type: string | undefined }> = [];
            if (newMessage.attachments) {
                for (const attachmentCollection of newMessage.attachments) {
                    const [_, attachment] = attachmentCollection;
                    attachmentLinks.push({
                        name: attachment.name,
                        url: attachment.proxyURL,
                        type: attachment.contentType ?? undefined,
                    });
                }
            }

            await notifiarrWebhook(
                {
                    event: this.name,
                    botToken: newMessage.client.token,
                    server: newMessage.guild.id,
                    newMessage: JSON.stringify(newMessage),
                    oldMessage: JSON.stringify(oldMessage),
                    attachments: JSON.stringify(attachmentLinks),
                },
                newMessage.guild.shardId,
                webhookTimestamp,
            );
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
