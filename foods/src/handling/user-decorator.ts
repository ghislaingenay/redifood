import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TUser } from 'redifood-module/src/interfaces';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser as TUser;
  },
);
