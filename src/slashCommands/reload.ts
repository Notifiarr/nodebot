import { SlashCommandBuilder } from 'discord.js';
import loadSlashCommand from '../functions/loadSlashCommand.js';
import { type SlashCommandModule } from '../types.js';

const slashCommand: SlashCommandModule = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption((option) =>
            option.setName('command').setDescription('The command to reload.').setRequired(true),
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const slashCommandName = interaction.options.getString('command', true).toLowerCase();

        const slashCommand = interaction.client.slashCommands.get(slashCommandName);

        if (!slashCommand) {
            await interaction.editReply(`There is no command with name \`${slashCommandName}\`!`);
            return;
        }

        const slashCommandFile = `${slashCommand.data.name}.js`;
        const slashCommandsPath = new URL(import.meta.url);
        await loadSlashCommand(interaction.client, slashCommandFile, slashCommandsPath);
        await interaction.editReply(`Command \`${slashCommand.data.name}\` was reloaded!`);
    },
};

export default slashCommand;
