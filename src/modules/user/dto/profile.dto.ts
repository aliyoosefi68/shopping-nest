import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { Gender } from "../enum/gender.enum";

export class ProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 100)
  nick_name: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({ nullable: true, format: "binary" })
  image: string;

  @ApiPropertyOptional({ nullable: true, enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: string;
  @ApiPropertyOptional({ nullable: true, example: "1996-02-22T12:01:26.487Z" })
  birthday: Date;
  @ApiPropertyOptional({ nullable: true })
  x_profile: string;
  @ApiPropertyOptional({ nullable: true })
  linkedin_profile: string;
}
export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: "ایمیل وارد شده صحیح نمیباشد" })
  email: string;
}
export class ChangePhoneDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "شماره موبایل وارد شده صحیح نمیباشد" })
  phone: string;
}
export class ChangeUsernameDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string;
}
