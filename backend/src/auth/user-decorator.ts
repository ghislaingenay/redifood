import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserPayload } from '../../redifood-module/src/interfaces';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    try {
      const payload = jwt.verify(
        req.session.jwt,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.JWT_TOKEN!,
      ) as UserPayload;
      return payload;
    } catch (err) {
      /* empty */
    }
  },
);
