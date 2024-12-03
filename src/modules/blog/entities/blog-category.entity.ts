import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { CategoryBlogEntity } from "src/modules/category-blog/entity/category-blog.entity";

@Entity("blog_category")
export class BlogCategoryEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  blogId: number;
  @Column()
  categoryId: number;
  @ManyToOne(() => BlogEntity, (blog) => blog.categories, {
    onDelete: "CASCADE",
  })
  blog: BlogEntity;
  @ManyToOne(() => CategoryBlogEntity, (category) => category.blog_categories, {
    onDelete: "CASCADE",
  })
  category: CategoryBlogEntity;
}
