import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  // OneToMany,
} from "typeorm";
import { User } from "./users.entity";
// import { Product } from "./product.entity";

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

  // @OneToMany(() => Product, (product) => product.shop) 
  // products: Product[]; 
}
