import { InjectRepository } from "@nestjs/typeorm";
import Token from "src/entities/token.entity";
import { Repository } from "typeorm";
import { UserService } from "../users/user.service";
import TokenCreateInput from "./dto/token-create-input.dto";
import { v4 as idGen } from "uuid";
import * as bcrypt from "bcrypt";

export default class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
    private userService: UserService,
  ) {}

  async create(user: TokenCreateInput) {
    if (!this.userService.validateUser(user)) {
      return {
        isError: true,
        data: "403",
      };
    }
    const token = await this.tokenRepo.save({
      id: idGen(),
      userId: await this.userService.getUserIdByUsername(user.username),
      tokenValue: await bcrypt.hash(user.username + new Date().toDateString(), 10),
      expiredAt: new Date(),
    });
    return {
      isError: false,
      data: token.tokenValue,
    };
  }
}
