import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BlogEntity } from "./blog.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

@Entity("blog_comment")
export class BlogCommentEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  text: string;
  @Column({ default: true })
  accepted: boolean;
  @Column()
  blogId: number;
  @Column()
  userId: number;
  @Column({ nullable: true })
  parentId: number;
  @ManyToOne(() => UserEntity, (user) => user.blog_comments, {
    onDelete: "CASCADE",
  })
  user: UserEntity;
  @ManyToOne(() => BlogEntity, (blog) => blog.comments, { onDelete: "CASCADE" })
  blog: BlogEntity;
  @ManyToOne(() => BlogCommentEntity, (parent) => parent.children, {
    onDelete: "CASCADE",
  })
  parent: BlogCommentEntity;
  @OneToMany(() => BlogCommentEntity, (comment) => comment.parent)
  @JoinColumn({ name: "parent" })
  children: BlogCommentEntity[];
  @CreateDateColumn()
  created_at: Date;
}
