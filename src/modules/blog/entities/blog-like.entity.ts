import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

@Entity("blog_like")
export class BlogLikesEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  blogId: number;
  @Column()
  userId: number;
  @ManyToOne(() => UserEntity, (user) => user.blog_likes, {
    onDelete: "CASCADE",
  })
  user: UserEntity;
  @ManyToOne(() => BlogEntity, (blog) => blog.likes, { onDelete: "CASCADE" })
  blog: BlogEntity;
}
