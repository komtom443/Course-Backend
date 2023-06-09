import { IsEmail, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export default class UserCreateInput {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  age: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  passwd: string;
}
