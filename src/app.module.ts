import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { CategoryProductModule } from "./modules/category-product/category.module";
import { SellerModule } from "./modules/sellers/seller.module";
import { CategoryBlogModule } from "./modules/category-blog/category-blog.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "Rez1sfa1370.",
      database: "shop",
      autoLoadEntities: false,
      synchronize: true,
      entities: [
        "dist/**/**/**/*.entity{.ts,.js}",
        "dist/**/**/*.entity{.ts,.js}",
      ],
    }),
    AuthModule,
    UserModule,
    SellerModule,
    CategoryProductModule,
    CategoryBlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
