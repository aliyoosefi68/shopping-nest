import { Roles } from "src/common/enum/role.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProfileEntity } from "./profile.entity";

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
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  //relations
  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile: ProfileEntity;
}
