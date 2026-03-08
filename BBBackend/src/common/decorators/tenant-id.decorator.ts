import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export interface TenantIdOptions {
  optional?: boolean;
}

export const TenantId = createParamDecorator(
  (options: TenantIdOptions = { optional: false }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.tenantId === undefined) {
      if (options.optional) {
        return undefined; // Cambiado de null a undefined
      }
      throw new UnauthorizedException('Tenant not found in user session');
    }

    return user.tenantId;
  },
);
