import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { userController } from "./user.controller";
import { UserService } from "./user.service";
import { S3Service } from "../s3/s3.service";
import { ProfileEntity } from "./entity/profile.entity";

import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
  controllers: [userController],
  providers: [UserService, S3Service],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
