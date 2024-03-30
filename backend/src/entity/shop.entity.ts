import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./users.entity";
import { Product } from "./product.entity";
@Entity()
export class Shop {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  address: string;

  @ManyToOne(() => User, (user) => user.shop) //relation avec l'user qui peut avoir plusieurs shops
  userId: User;

  @OneToMany(() => Product, (product) => product.shopId)
  product: Product[];
}
