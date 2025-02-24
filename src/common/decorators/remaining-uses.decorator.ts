import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REMAINING_USES_KEY } from '../guards/rate-limit.guard';

export const RemainingUses = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const reflector = new Reflector();
    return reflector.get<number>(REMAINING_USES_KEY, ctx.getHandler()) ?? 0;
  },
);
