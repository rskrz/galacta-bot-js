import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ChatInputCommandInteraction } from 'discord.js';
import { RateLimitException } from '../exceptions/rate-limit.exception';

@Catch(RateLimitException)
export class RateLimitExceptionFilter implements ExceptionFilter {
  async catch(exception: RateLimitException, host: ArgumentsHost) {
    const interaction = host
      .switchToRpc()
      .getData<[ChatInputCommandInteraction]>()[0];

    await interaction.editReply({
      content: exception.message,
    });
  }
}
