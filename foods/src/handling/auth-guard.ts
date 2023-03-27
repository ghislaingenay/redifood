import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

interface UserPayload {
  id: string;
  email: string;
}
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const payload = jwt.verify(
        req.session.jwt,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.JWT_TOKEN!,
      ) as UserPayload;
      req.currentUser = payload;
      if (!req.currentUser) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
