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
    return await this.userSevice.updateUsers(users);
  }

  @Post("username")
  async checkUsername(@Body() username: { username: string }) {
    console.log(username);

    return await this.userSevice.checkUsername(username.username);
  }

  @Get(":id")
  async getByID(@Param() { id }: { id: string }) {
    return await this.userSevice.getUser(id);
  }
}
