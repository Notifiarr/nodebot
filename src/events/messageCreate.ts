import { Events } from 'discord.js';
import config from '../config.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.MessageCreate> = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) {
            return;
        }

        if (!message.inGuild()) {
            return;
        }

        // @ts-ignore
        let attachmentLinks = [];
        if (message.attachments) {
            message.attachments.forEach(attachment => {
                attachmentLinks.push({name: attachment.name, url: attachment.proxyURL, type: attachment.contentType});
            });
        }

        if (config.testing && !config.devDiscordUsers.includes(Number(message.author.id))) {
            logger.verbose(`Ignoring non allowed user ${message.author.username} (${message.author.id})`);
            return;
        }

        logger.verbose(`shard ${message.guild.shardId}: ${this.name}->${message.guild.id}`);
        try {
            const messages = await message.channel.messages.fetch({ before: message.id, limit: 15 });
            await notifiarrWebhook({
                // eslint-disable-next-line @typescript-eslint/naming-convention
                mediarequest_eventtype: 'ping',
                botToken: message.client.token,
                server: message.guild.id,
                channel: message.channel.id,
                message: JSON.stringify(message),
                previousMessage: JSON.stringify(messages),
                authorRoles: [...(message.member?.roles.cache.keys() ?? [])],
                // @ts-ignore
                attachments: attachmentLinks
            }, message.guild.shardId, 0);
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
