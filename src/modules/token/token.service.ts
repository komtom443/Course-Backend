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
    if (!(await this.userService.validateUser(user))) {
      return {
        isError: true,
        data: "403",
      };
    }
    const userId = await this.userService.getUserIdByUsername(user.username);

    if (
      (await this.tokenRepo.count({
        where: { userId },
      })) !== 1
    ) {
      const token = await this.tokenRepo.findOne({
        where: { userId },
      });
      return {
        isError: false,
        data: token.tokenValue,
      };
    }
    const token = await this.tokenRepo.save({
      id: idGen(),
      userId,
      tokenValue: await bcrypt.hash(user.username + new Date().toDateString(), 10),
      expiredAt: new Date(),
    });
    return {
      isError: false,
      data: token.tokenValue,
    };
  }

  async validateToken(tokenValue: string, role?: "standard" | "premium" | "admin") {
    role = role ?? "standard";
    const token = await this.tokenRepo.find({
      where: { tokenValue, role },
    });
    return token ? true : false;
  }
}
