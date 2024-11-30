import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsJWT, IsMobilePhone, Length } from "class-validator";

export class SellerSignupDto {
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  @Length(3, 50)
  store_name: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  @Length(3, 50)
  seller_name: string;
  @ApiProperty()
  @Length(3, 50)
  seller_family: string;
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "شماره موبایل شما نامعتبر است" })
  phone: string;
  @ApiPropertyOptional()
  invite_code: string;
}

export class SellerSendOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "شماره وارد شده صحیح نمیباشد" })
  mobile: string;
}

export class SellerCheckOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "شماره وارد شده صحیح نمیباشد" })
  mobile: string;
  @ApiProperty()
  @Length(5, 5, { message: "رمز یکبار مصرف باید ۵ کاراکتر باشد" })
  code: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsJWT({ message: "توکن ارسال شده صحیح نمیباشد" })
  refreshToken: string;
}
