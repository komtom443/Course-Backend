import { IsEmail, IsInt, IsNotEmpty, IsPositive } from "class-validator";
export default class UserUpdateInput {
  @IsNotEmpty()
  id: string;

  firstName?: string;

  lastName?: string;

  phone?: string;

  isActive?: boolean;

  @IsInt()
  @IsPositive()
  age?: number;

  @IsEmail()
  email?: string;

  userType?: "standard" | "premium" | "admin";
}
