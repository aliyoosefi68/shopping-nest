import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("category-blog")
export class CategoryBlogEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column({ nullable: true })
  priority: number;
  // @OneToMany(() => BlogCategoryEntity, blog => blog.category)
  // blog_categories: BlogCategoryEntity[];
}
