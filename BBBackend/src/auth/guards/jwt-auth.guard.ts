import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Añadir lógica personalizada si es necesario
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Si hay error o no hay usuario, lanzar UnauthorizedException
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
