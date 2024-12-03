import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { BlogService } from "./services/blog.service";
import { BlogController } from "./controllers/blog.controller";
import { CategoryBlogEntity } from "../category-blog/entity/category-blog.entity";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { BlogLikesEntity } from "./entities/blog-like.entity";
import { BlogBookmarkEntity } from "./entities/bookmark.entity";
import { BlogCommentEntity } from "./entities/blog-comment.entity";
import { CategoryBlogService } from "../category-blog/category-blog.service";
import { S3Service } from "../s3/s3.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      CategoryBlogEntity,
      BlogCategoryEntity,
      BlogLikesEntity,
      BlogBookmarkEntity,
      BlogCommentEntity,
    ]),
  ],
  providers: [BlogService, CategoryBlogService, S3Service],
  controllers: [BlogController],
})
export class BlogModule {}
