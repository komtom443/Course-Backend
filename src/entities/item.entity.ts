import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class Item {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: "integer" })
  price: number;

  @Column({ default: false })
  isMedium: boolean;

  @Column({ default: false })
  isBig: boolean;

  @Column({ nullable: true })
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
