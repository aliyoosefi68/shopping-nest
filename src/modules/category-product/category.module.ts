import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryProductEntity } from "./entity/category.entity";
import { CatagoryProductService } from "./category.service";
import { CategoryController } from "./category.controller";
import { S3Service } from "../s3/s3.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([CategoryProductEntity])],
  controllers: [CategoryController],
  providers: [CatagoryProductService, S3Service],
  exports: [CatagoryProductService],
})
export class CategoryProductModule {}
