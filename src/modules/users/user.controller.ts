import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import UserCreateInput from "./dto/user-create-input.dto";
import UserUpdateInput from "./dto/user-update-input.dto";

@Controller("user")
export class UserController {
  constructor(private userSevice: UserService) {}

  @Get()
  async get(@Query("sort") sort?: "ASC" | "DESC") {
    return await this.userSevice.getUsers(sort);
  }

  @Post("get_basic")
  async getBasic(@Body() { userToken }: { userToken: string }) {
    return await this.userSevice.getBasic(userToken);
  }

  @Post()
  async create(@Body() user: UserCreateInput) {
    return await this.userSevice.createUsers(user);
  }

  @Put()
  async update(@Body() users: UserUpdateInput[]) {
    console.log("YES");

    return await this.userSevice.updateUsers(users);
  }
}
