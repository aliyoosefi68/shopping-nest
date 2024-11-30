import { Module } from "@nestjs/common";
import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SellerEntity } from "./entites/seller.entity";
import { CategoryProductModule } from "../category-product/category.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([SellerEntity]), CategoryProductModule],
  providers: [SellerService, JwtService],
  controllers: [SellerController],
})
export class SellerModule {}
