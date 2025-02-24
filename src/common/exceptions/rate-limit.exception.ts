import { ForbiddenException } from '@nestjs/common';

export class RateLimitException extends ForbiddenException {
  constructor() {
    super(
      `You have used all your free commands today. Buy premium for unlimited uses`,
    );
  }
}
