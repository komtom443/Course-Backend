import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
export default class User {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ length: 60 })
  passwd: string;

  @Column()
  userType: "standard" | "premium" | "admin";

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
