import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Token {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  tokenValue: string;

  @Column({ default: "standard" })
  role: "standard" | "premium" | "admin";

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "date" })
  expiredAt: Date;
}
