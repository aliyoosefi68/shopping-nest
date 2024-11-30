import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { CategoryBlogEntity } from "./entity/category-blog.entity";
import { CategoryBlogService } from "./category-blog.service";
import { CategoryBlogController } from "./category-blog.controller";

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([CategoryBlogEntity]),
  ],
  controllers: [CategoryBlogController],
  providers: [CategoryBlogService],
})
export class CategoryBlogModule {}
