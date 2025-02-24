import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatInputCommandInteraction } from 'discord.js';
import { DiscordService } from 'src/discord/discord.service';
import { CooldownException } from '../exceptions/cooldown.exception';
import { IS_PREMIUM_KEY } from './premium.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CooldownGuard implements CanActivate {
  constructor(
    private readonly discordService: DiscordService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPremium = this.reflector.get<boolean>(
      IS_PREMIUM_KEY,
      context.getHandler(),
    );

    if (isPremium) {
      return true;
    }

    const interaction = context
      .switchToRpc()
      .getData<[ChatInputCommandInteraction]>()[0];
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply();
    }

    const cooldown = await this.discordService.enforceShortCooldown(
      interaction.user.id,
      interaction.commandName,
    );

    if (cooldown > 0) {
      throw new CooldownException(cooldown);
    }

    return true;
  }
}
