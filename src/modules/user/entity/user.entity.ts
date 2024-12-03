import { Roles } from "src/common/enum/role.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProfileEntity } from "./profile.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { BlogBookmarkEntity } from "src/modules/blog/entities/bookmark.entity";
import { BlogCommentEntity } from "src/modules/blog/entities/blog-comment.entity";
import { BlogLikesEntity } from "src/modules/blog/entities/blog-like.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column({ unique: true })
  mobile: string;
  @Column({ unique: true, nullable: true })
  username: string;
  @Column({ nullable: true })
  password: string;

  @Column({ default: Roles.User })
  role: string;
  @Column({ nullable: true })
  otp_code: string;
  @Column({ nullable: true })
  otp_expires_in: Date;
  @Column({ nullable: true })
  last_change_password: Date;
  @Column({ nullable: true })
  agentId: number;
  @Column({ nullable: true })
  profileId: number;

  @Column({ nullable: true })
  new_email: string;

  @Column({ nullable: true })
  new_phone: string;

  @Column({ nullable: true, default: false })
  verify_email: boolean;

  @Column({ nullable: true, default: false })
  verify_phone: boolean;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  //relations
  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile: ProfileEntity;

  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];
  @OneToMany(() => BlogLikesEntity, (like) => like.user)
  blog_likes: BlogLikesEntity[];
  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.user)
  blog_bookmarks: BlogBookmarkEntity[];
  @OneToMany(() => BlogCommentEntity, (comment) => comment.user)
  blog_comments: BlogCommentEntity[];
}
