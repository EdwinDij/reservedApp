// product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Shop } from "./shop.entity";
import { ProductShop } from "./product-shop.entity";

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

  @OneToMany(() => ProductShop, (productShop) => productShop.product)
  productShops: ProductShop[];

  @ManyToMany(() => Shop, (shop) => shop.products)
  shops: Shop[];
}
