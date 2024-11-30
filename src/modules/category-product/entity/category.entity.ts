import { SellerEntity } from "src/modules/sellers/entites/seller.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("category-product")
export class CategoryProductEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column()
  slug: string;
  @Column({ nullable: true })
  image: string;
  @Column({ nullable: true })
  imageKey: string;
  @Column()
  show: boolean;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => CategoryProductEntity, (category) => category.children, {
    onDelete: "CASCADE",
  })
  parent: CategoryProductEntity;
  @OneToMany(() => CategoryProductEntity, (category) => category.parent)
  children: CategoryProductEntity[];

  @OneToMany(() => SellerEntity, (seller) => seller.category)
  sellers: SellerEntity[];
}
