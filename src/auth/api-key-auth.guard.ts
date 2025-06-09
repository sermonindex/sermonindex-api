import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || apiKey !== this.config.API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
