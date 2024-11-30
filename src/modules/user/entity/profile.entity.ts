import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("profile")
export class ProfileEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ nullable: true })
  nick_name: string;
  @Column({ nullable: true })
  bio: string;
  @Column({ nullable: true })
  profile_image: string;
  @Column({ nullable: true })
  profile_imageKey: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  birthday: Date;
  @Column({ nullable: true })
  x_profile: string;
  @Column({ nullable: true })
  linkedin_profile: string;
  @Column({ nullable: true })
  instagram_profile: string;
  @Column()
  userId: number;
  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: "CASCADE" })
  user: UserEntity;
}
