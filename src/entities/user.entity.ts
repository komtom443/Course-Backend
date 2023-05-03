import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
export default class User {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: "integer" })
  age: number;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ length: 60 })
  passwd: string;

  @Column({})
  avatarUrl: string;

  @Column({ default: "standard" })
  userType: "standard" | "premium" | "admin";

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
