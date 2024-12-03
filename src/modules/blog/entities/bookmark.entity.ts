import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

@Entity("blog_bookmark")
export class BlogBookmarkEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  blogId: number;
  @Column()
  userId: number;
  @ManyToOne(() => UserEntity, (user) => user.blog_bookmarks, {
    onDelete: "CASCADE",
  })
  user: UserEntity;
  @ManyToOne(() => BlogEntity, (blog) => blog.bookmarks, {
    onDelete: "CASCADE",
  })
  blog: BlogEntity;
}
