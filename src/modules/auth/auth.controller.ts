import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormType } from "src/common/enum/formType.enum";
import {
  ChangePasswordDto,
  CheckOtpDto,
  ForgetPasswordDto,
  LoginDto,
  RefreshTokenDto,
  SendOtpDto,
  SignupDto,
} from "./dto/auth.dto";
import { Request } from "express";
import { AuthGuard } from "./guard/auth.guard";
import { AuthDecorator } from "src/common/decorator/auth.decorator";

@Controller("/auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post("login")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("send-otp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post("check-otp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  chechOtp(@Body() dto: CheckOtpDto) {
    return this.authService.checkOtp(dto);
  }

  @Post("forget-password")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  forgetPassword(@Body() dto: ForgetPasswordDto) {
    return this.authService.forgetPassword(dto);
  }

  @Post("changeme")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto);
  }

  @Post("refreshtoken")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Get("check-login")
  @AuthDecorator()
  checkLogin(@Req() req: Request) {
    return req.user;
  }
}
