import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Shop } from "./index";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  plan: string | null;

  @Column({ nullable: true })
  isPremium: boolean | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updateAt: Date;

  @OneToMany(() => Shop, (shop) => shop.user, { onDelete: "CASCADE" })
  shop: Shop[];
}
