import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { SellerService } from "./seller.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import {
  SellerCheckOtpDto,
  SellerSendOtpDto,
  SellerSignupDto,
} from "./dto/seller.dto";
import { FormType } from "src/common/enum/formType.enum";

@Controller("seller")
@ApiTags("Sellers")
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post("signup")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  signup(@Body() signupDto: SellerSignupDto) {
    return this.sellerService.signup(signupDto);
  }

  @Post("send-otp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  sendOtp(@Body() dto: SellerSendOtpDto) {
    return this.sellerService.sendOtp(dto);
  }

  @Post("check-otp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  chechOtp(@Body() dto: SellerCheckOtpDto) {
    return this.sellerService.checkOtp(dto);
  }

  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.sellerService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.sellerService.deleteSeller(+id);
  }
}
