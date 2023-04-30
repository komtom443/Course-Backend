import { Controller } from "@nestjs/common";
import { IsInt, IsNotEmpty } from "class-validator";

@Controller()
export default class ItemController {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsInt()
  price: number;

  isMedium: boolean;

  isBig: boolean;

  categoryId?: string;
}
