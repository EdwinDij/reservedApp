import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  number_shop: number | null;

  @Column({ type: "simple-array", nullable: true, default: []})
  shops: string[] | null;

  @Column({ nullable: true })
  plan: string | null;

  @Column({ nullable: true})
  isPremium: boolean | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updateAt: Date;
}
