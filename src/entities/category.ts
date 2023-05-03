import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import Item from "./item.entity";

@Entity()
export default class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}
