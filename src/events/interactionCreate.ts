import { Collection, Events, inlineCode, time, type InteractionReplyOptions } from 'discord.js';
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

        if (interaction.isAutocomplete() || interaction.isChatInputCommand()) {
            const slashCommand = interaction.client.slashCommands.get(interaction.commandName);

            if (!slashCommand) {
                logger.warn(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            if (interaction.isAutocomplete()) {
                if (!slashCommand.autocomplete) {
                    logger.warn(`No autocomplete matching ${interaction.commandName} was found.`);
                    return;
                }

                try {
                    await slashCommand.autocomplete(interaction);
                } catch (error) {
                    logger.error('caught:', error);
                }
            }

            if (interaction.isChatInputCommand()) {
                const { cooldowns } = interaction.client;

                if (!cooldowns.has(slashCommand.data.name)) {
                    cooldowns.set(slashCommand.data.name, new Collection());
                }

                const now = Date.now();
                const timestamps = cooldowns.get(slashCommand.data.name) ?? new Collection();
                const defaultCooldownDuration = 3;
                const cooldownAmount = (slashCommand.cooldown ?? defaultCooldownDuration) * 1000;

                if (timestamps.has(interaction.user.id)) {
                    const expirationTime = Number(timestamps.get(interaction.user.id)) + cooldownAmount;

                    if (now < expirationTime) {
                        const expiredTimestamp = Math.round(expirationTime / 1000);
                        await interaction.reply({
                            content: `Please wait, you are on a cooldown for ${inlineCode(
                                slashCommand.data.name,
                            )}. You can use it again ${time(expiredTimestamp, 'R')}.`,
                            ephemeral: true,
                        });
                        return;
                    }
                }

                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

                try {
                    await slashCommand.execute(interaction);
                } catch (error) {
                    logger.error('caught:', error);
                    const options: InteractionReplyOptions = {
                        content: 'There was an error while executing this command!',
                        ephemeral: true,
                    };
                    await (interaction.replied || interaction.deferred
                        ? interaction.followUp(options)
                        : interaction.reply(options));
                }
            }
        }

        if (interaction.isMessageComponent()) {
            // Handle message components
        }
    },
};

export default event;
