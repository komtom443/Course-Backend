import { IsNotEmpty } from "class-validator";

export default class TokenCreateInput {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  passwd: string;

  isRemember: boolean;
}
