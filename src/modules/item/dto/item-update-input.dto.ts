import { IsEmail, IsInt, IsNotEmpty, IsPositive } from "class-validator";
export default class ItemUpdateInput {
  @IsNotEmpty()
  name?: string;

  isBig?: boolean;

  isMedium?: boolean;

  isStock?: boolean;

  @IsInt()
  @IsPositive()
  price?: number;

  categoryId?: string;
}
