// shop.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./index";
import { Product } from "./product.entity";
import { ProductShop } from "./product-shop.entity";

@Entity()
export class Shop {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.shop) // relation avec l'utilisateur qui peut avoir plusieurs shops
  user: User;

  @OneToMany(() => ProductShop, (productShop) => productShop.shop)
  productShops: ProductShop[];

  @ManyToMany(() => Product, (product) => product.shops)
  @JoinTable()
  products: Product[];
}
