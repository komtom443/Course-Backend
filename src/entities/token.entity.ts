import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Token {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  tokenValue: string;

  @Column({ default: false })
  isRemember: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "datetime" })
  expiredAt: Date;

  @Column()
  role: "standard" | "teacher" | "admin";
}
