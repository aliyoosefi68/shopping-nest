import { UserEntity } from "src/modules/user/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BlogStatus } from "../enums/status.enum";
import { BlogCategoryEntity } from "./blog-category.entity";
import { BlogBookmarkEntity } from "./bookmark.entity";
import { BlogCommentEntity } from "./blog-comment.entity";
import { BlogLikesEntity } from "./blog-like.entity";

@Entity("blog")
export class BlogEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  content: string;
  @Column({ nullable: true })
  image: string;
  @Column({ nullable: true })
  imageKey: string;
  @Column({ unique: true })
  slug: string;
  @Column()
  time_for_study: string;
  @Column({ default: BlogStatus.Draft })
  status: string;
  @Column()
  authorId: number;
  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: "CASCADE" })
  author: UserEntity;
  @OneToMany(() => BlogLikesEntity, (like) => like.blog)
  likes: BlogLikesEntity[];
  @OneToMany(() => BlogCategoryEntity, (category) => category.blog)
  categories: BlogCategoryEntity[];
  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.blog)
  bookmarks: BlogBookmarkEntity[];
  @OneToMany(() => BlogCommentEntity, (comment) => comment.blog)
  comments: BlogCommentEntity[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
