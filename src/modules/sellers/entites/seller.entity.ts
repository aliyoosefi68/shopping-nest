import { CategoryProductEntity } from "src/modules/category-product/entity/category.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("seller")
export class SellerEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  store_name: string;

  @Column()
  seller_name: string;

  @Column()
  seller_family: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  categoryId: number;

  @Column()
  city: string;

  @Column({ nullable: true })
  invite_code: string;

  @ManyToOne(() => CategoryProductEntity, (category) => category.sellers, {
    onDelete: "SET NULL",
  })
  category: CategoryProductEntity;

  @Column({ nullable: true })
  agentId: number;

  @Column({ nullable: true })
  otp_code: string;

  @Column({ nullable: true })
  otp_expires_in: Date;

  @ManyToOne(() => SellerEntity, (seller) => seller.subsets)
  agent: SellerEntity;

  @OneToMany(() => SellerEntity, (subset) => subset.agent)
  subsets: SellerEntity[];
}
