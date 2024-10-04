import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) return false;

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
