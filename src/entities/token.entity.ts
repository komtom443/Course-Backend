import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Token {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  tokenValue: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "date" })
  expiredAt: Date;

  @Column()
  role: "standard" | "premium" | "admin";
}
