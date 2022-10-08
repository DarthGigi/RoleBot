import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import { Category as ICategory } from '../../src/database/entities/category.entity';

import { Category } from '../../utilities/types/commands';
import { SlashCommand } from '../slashCommand';
import { handleInteractionReply } from '../../utilities/utils';
import {
  EDIT_CATEGORY_BY_ID,
  GET_CATEGORY_BY_NAME,
} from '../../src/database/queries/category.query';

export class EditCategoryCommand extends SlashCommand {
  constructor() {
    super(
      'category-edit',
      `Edit any category's name, description, or if it's mutually exclusive.`,
      Category.category,
      [PermissionsBitField.Flags.ManageRoles]
    );

    this.addStringOption(
      'name',
      'The name of the category, this is case sensitive and used to find your category.',
      true
    );
    this.addStringOption(
      'new-name',
      'Change the name of the category. This is the title of the embed.'
    );
    this.addStringOption(
      'new-description',
      'Change the description. This is shown above your react roles in the embed.'
    );
    this.addBoolOption(
      'mutually-exclusive',
      'Change if roles in this category should be mutually exclusive.'
    );
    this.addBoolOption(
      'remove-required-role',
      'Remove all required roles for the category.'
    );
    this.addRoleOption(
      'new-required-role',
      'Change what the required roles are for the category.'
    );
  }

  execute = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guildId) {
      return this.log.error(`GuildID did not exist on interaction.`);
    }

    const [name, newName, newDesc] = this.extractStringVariables(
      interaction,
      'name',
      'new-name',
      'new-description'
    );

    const mutuallyExclusive =
      interaction.options.getBoolean('mutually-exclusive');

    const removeRequiredRole = interaction.options.getBoolean(
      'remove-required-role'
    );

    const newRequiredRoleId =
      interaction.options.getRole('new-required-role')?.id ?? undefined;

    if (
      !newName &&
      !newDesc &&
      !newRequiredRoleId &&
      removeRequiredRole === null &&
      mutuallyExclusive === null
    ) {
      this.log.info(
        `User didn't change anything about the category`,
        interaction.guildId
      );

      return handleInteractionReply(this.log, interaction, {
        ephemeral: true,
        content: `Hey! You need to pass at _least_ one updated field about the category.`,
      });
    }

    if (!name) {
      this.log.error(
        `Required option name was undefined.`,
        interaction.guildId
      );

      return handleInteractionReply(this.log, interaction, {
        ephemeral: true,
        content: `Hey! I had an issue finding the category. Please wait a second and try again.`,
      });
    }

    const category = await GET_CATEGORY_BY_NAME(interaction.guildId, name);

    if (!category) {
      this.log.info(
        `Category not found with name[${name}]`,
        interaction.guildId
      );

      return handleInteractionReply(this.log, interaction, {
        ephemeral: true,
        content: `Hey! I couldn't find a category with that name. The name is _case sensitive_ so make sure it's typed correctly.`,
      });
    }

    const requiredRoleId = newRequiredRoleId ?? category.requiredRoleId;

    const updatedCategory: Partial<ICategory> = {
      name: newName ?? category.name,
      description: newDesc ?? category.description,
      mutuallyExclusive: mutuallyExclusive ?? category.mutuallyExclusive,
      requiredRoleId: removeRequiredRole ? null : requiredRoleId,
    };

    EDIT_CATEGORY_BY_ID(category.id, updatedCategory)
      .then(() => {
        this.log.info(
          `Updated category[${category.id}] successfully.`,
          interaction.guildId
        );

        handleInteractionReply(this.log, interaction, {
          ephemeral: true,
          content: `Hey! I successfully updated the category \`${category.name}\` for you.`,
        });
      })
      .catch((e) =>
        this.log.critical(
          `Failed to edit category[${category.id}]\n${e}`,
          interaction.guildId
        )
      );
  };
}
