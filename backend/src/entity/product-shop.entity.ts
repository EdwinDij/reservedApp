// product-shop.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Shop } from "./shop.entity";

@Entity()
export class ProductShop {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: true }) // Ajout d'une colonne isActive
  isActive: boolean;

  @ManyToOne(() => Product, (product) => product.productShops, {
    onDelete: "CASCADE",
  }) 
  product: Product;

  @ManyToOne(() => Shop, (shop) => shop.productShops, { onDelete: "CASCADE" })
  shop: Shop;
}
