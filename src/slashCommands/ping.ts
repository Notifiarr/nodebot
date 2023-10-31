import { SlashCommandBuilder } from 'discord.js';
import { type SlashCommandModule } from '../types.js';

const slashCommand: SlashCommandModule = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with roundtrip latency and websocket heartbeat'),
    async execute(interaction) {
        const sent = await interaction.reply({
            content: 'Pinging...',
            fetchReply: true,
        });
        await interaction.editReply(
            `Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms\nWebsocket heartbeat: ${
                interaction.client.ws.ping
            }ms`,
        );
    },
};

export default slashCommand;
