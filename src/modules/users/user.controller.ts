import { Body, Controller, Get, Inject, Param, Post, Put, Query, forwardRef } from "@nestjs/common";
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

  @Post("getUsersAdmin")
  async getUsersAdmin(@Body() body: any) {
    return await this.userSevice.getUsersAdmin(body);
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
    return await this.userSevice.checkUsername(username.username);
  }

  @Post("teacher")
  async getTeacher(@Body() { token }: { token: string }) {
    return await this.userSevice.getTeacher(token);
  }

  @Post("email")
  async checkEmail(@Body() { email }: { email: string }) {
    return await this.userSevice.checkEmail(email);
  }

  @Get(":id")
  async getByID(@Param() { id }: { id: string }) {
    return await this.userSevice.getUser(id);
  }
}
