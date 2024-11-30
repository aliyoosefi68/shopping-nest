import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";

import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "src/common/decorator/skip-auth.decorator";
import { SellerService } from "../seller.service";

@Injectable()
export class SellerGuard implements CanActivate {
  constructor(
    private sellerService: SellerService,
    private reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext) {
    const isSkippedAuthorization = this.reflector.get<boolean>(
      SKIP_AUTH,
      context.getHandler()
    );
    if (isSkippedAuthorization) return true;
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);
    request.user = await this.sellerService.validateAccessToken(token);
    return true;
  }

  protected extractToken(request: Request) {
    const { authorization } = request.headers;
    if (!authorization || authorization?.trim() == "")
      throw new UnauthorizedException("مجددا وارد شوید");

    const [bearer, token] = authorization?.split(" ");
    if (bearer?.toLocaleLowerCase() !== "bearer" || !token || !isJWT(token)) {
      throw new UnauthorizedException("ورود اجباریست");
    }

    return token;
  }
}
