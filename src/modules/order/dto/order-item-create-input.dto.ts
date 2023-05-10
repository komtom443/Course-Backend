import { IsNotEmpty, IsPositive } from "class-validator";

export default class OrderItemCreateInput {
  @IsNotEmpty()
  itemId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsPositive()
  sizeS?: number;

  @IsPositive()
  sizeM?: number;

  @IsPositive()
  sizeL?: number;
}
