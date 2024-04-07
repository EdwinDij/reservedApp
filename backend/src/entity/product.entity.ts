import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Shop } from "./index";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  price: string;

  @Column({ nullable: false })
  description: string;

  @ManyToOne(() => Shop, (shop) => shop.products)
  shop: Shop;
}
