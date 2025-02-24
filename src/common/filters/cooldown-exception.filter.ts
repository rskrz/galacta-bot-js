import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ChatInputCommandInteraction } from 'discord.js';
import { CooldownException } from '../exceptions/cooldown.exception';

@Catch(CooldownException)
export class CooldownExceptionFilter implements ExceptionFilter {
  async catch(exception: CooldownException, host: ArgumentsHost) {
    const interaction = host
      .switchToRpc()
      .getData<[ChatInputCommandInteraction]>()[0];

    await interaction.editReply(exception.message);
  }
}
