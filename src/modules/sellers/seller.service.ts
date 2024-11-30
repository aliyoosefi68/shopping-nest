import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SellerEntity } from "./entites/seller.entity";
import { Repository } from "typeorm";
import {
  RefreshTokenDto,
  SellerCheckOtpDto,
  SellerSendOtpDto,
  SellerSignupDto,
} from "./dto/seller.dto";
import { CatagoryProductService } from "../category-product/category.service";
import { randomInt } from "crypto";
import { mobileValidation } from "src/common/utils/mobile.util";
import { JwtService } from "@nestjs/jwt";
import { A_JWT_SECRET, R_JWT_SECRET } from "src/common/constant/jwt.const";

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private sellerRepository: Repository<SellerEntity>,
    private categoryService: CatagoryProductService,
    private jwtService: JwtService
  ) {}

  async signup(signupDto: SellerSignupDto) {
    const {
      categoryId,
      city,
      invite_code,
      seller_family,
      seller_name,
      phone,
      store_name,
    } = signupDto;

    const seller = await this.sellerRepository.findOneBy({ phone });
    if (seller)
      throw new ConflictException("فروشنده ای با این شماره قبلا ثبت نام کرده");

    const category = await this.categoryService.findOneById(categoryId);
    let agent: SellerEntity = null;
    if (invite_code) {
      agent = await this.sellerRepository.findOneBy({ invite_code });
    }

    const mobileNumber = parseInt(phone);
    const account = this.sellerRepository.create({
      city,
      invite_code: mobileNumber.toString(32).toUpperCase(),
      store_name,
      phone,
      seller_family,
      seller_name,
      agentId: agent?.id ?? null,
    });
    await this.sellerRepository.save(account);

    const otpCode = randomInt(10000, 99999);
    account.otp_code = String(otpCode);
    account.otp_expires_in = new Date(new Date().getTime() + 1000 * 60);
    await this.sellerRepository.save(account);
    return {
      message: "رمز یکبار مصرف برای شما ارسال شد",
      code: otpCode,
    };
  }

  async sendOtp(sendOtpDto: SellerSendOtpDto) {
    const { mobile } = sendOtpDto;
    const { phoneNumber } = mobileValidation(mobile);
    let seller = await this.sellerRepository.findOneBy({ phone: phoneNumber });
    if (!seller) throw new NotFoundException("حساب کاربری یافت نشد");
    if (seller.otp_expires_in >= new Date()) {
      throw new BadRequestException("کد قبلی هنوز منقضی نشده است");
    }
    const otpCode = randomInt(10000, 99999);
    seller.otp_code = String(otpCode);
    seller.otp_expires_in = new Date(new Date().getTime() + 1000 * 60);
    await this.sellerRepository.save(seller);
    return {
      message: "رمز یکبار مصرف برای شما ارسال شد",
      code: otpCode,
    };
  }

  async checkOtp(checkOtpDto: SellerCheckOtpDto) {
    const { mobile, code } = checkOtpDto;
    const { phoneNumber } = mobileValidation(mobile);
    let seller = await this.sellerRepository.findOneBy({ phone: phoneNumber });
    if (!seller) throw new NotFoundException("حساب کاربری یافت نشد");
    if (seller.otp_expires_in < new Date())
      throw new UnauthorizedException("کد ارسال شده منقضی شده است");
    if (code === seller.otp_code) {
      return this.tokenGenerator(seller.id, mobile);
    }
    throw new UnauthorizedException("کد ارسال شده صحیح نمییاشد");
  }

  findAll() {
    return this.sellerRepository.find({
      where: {},
    });
  }

  async findOne(id: number) {
    const seller = await this.sellerRepository.findOneBy({ id });
    if (!seller) throw new NotFoundException("فروشنده مورد نظر وجود ندارد");
    return seller;
  }

  async deleteSeller(id: number) {
    const seller = await this.findOne(id);
    await this.sellerRepository.delete({ id });
    return {
      message: "فروشنده مورد نظر حذف شد",
    };
  }
  async tokenGenerator(sellerId: number, mobile: string) {
    const accessToken = this.jwtService.sign(
      { sellerId, mobile },
      { secret: A_JWT_SECRET, expiresIn: "1d" }
    );
    const refreshToken = this.jwtService.sign(
      { sellerId, mobile },
      { secret: R_JWT_SECRET, expiresIn: "30d" }
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      const verified = this.jwtService.verify(refreshToken, {
        secret: R_JWT_SECRET,
      });
      if (verified?.sellerId && !isNaN(parseInt(verified.sellerId))) {
        if (verified?.mobile) {
          return { sellerId: verified?.sellerId, mobile: verified?.mobile };
        }
      }
      throw new UnauthorizedException("وارد حساب کاربری خود شوید");
    } catch (err) {
      throw new UnauthorizedException("مجددا وارد حساب کاربری خود شوید");
    }
  }

  verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: A_JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException("دوباره وارد شوید");
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const { sellerId, mobile } = this.verifyRefreshToken(refreshToken);
    if (sellerId && mobile) return this.tokenGenerator(+sellerId, mobile);
    throw new UnauthorizedException("مجددا وارد حساب کاربری خود شوید");
  }

  async validateAccessToken(token: string) {
    const { sellerId } = this.verifyAccessToken(token);
    const seller = await this.sellerRepository.findOneBy({ id: sellerId });
    if (!seller) throw new UnauthorizedException("دوباره وارد شوید");
    return seller;
  }
}
