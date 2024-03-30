import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Shop } from "./shop.entity";
@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  image: string;

  @ManyToOne(() => Shop, (shop) => shop.product)
  shopId: Shop;
}
