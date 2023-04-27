import { Body, Controller, Post, Query } from "@nestjs/common";
import User from "src/entities/user.entity";
import TokenService from "./token.service";
import { UserService } from "../users/user.service";
import TokenCreateInput from "./dto/token-create-input.dto";

@Controller("token")
export default class TokenController {
  constructor(private tokenService: TokenService) {}
  @Post()
  async create(@Body() user: TokenCreateInput) {
    return await this.tokenService.create(user);
  }
}
