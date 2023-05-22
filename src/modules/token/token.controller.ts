import { Body, Controller, Post, Put, Query } from "@nestjs/common";
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

  @Post("validate")
  async validate(@Body() { token }: { token: string }) {
    return await this.tokenService.validateToken(token);
  }

  @Post("getBasic")
  async getBasic(@Body() { token }: { token: string }) {
    return await this.tokenService.getBasicByToken(token);
  }

  @Post("getRole")
  async getRole(@Body() { token }: { token: string }) {
    return await this.tokenService.getRole(token);
  }
}
