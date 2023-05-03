import { IsEmail, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export default class OrderCreateInput {
  @IsNotEmpty()
  name: string;

  isBig?: boolean;

  isMedium?: boolean;

  isStock?: boolean;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  price: number;

  categoryId?: string;
}
