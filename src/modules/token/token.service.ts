import { InjectRepository } from "@nestjs/typeorm";
import Token from "src/entities/token.entity";
import { Repository } from "typeorm";
import { UserService } from "../users/user.service";
import TokenCreateInput from "./dto/token-create-input.dto";
import { v4 as idGen } from "uuid";
import * as bcrypt from "bcrypt";
import { log } from "console";

export default class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
    private userService: UserService,
  ) {}

  async create(user: TokenCreateInput) {
    try {
      if (!this.userService.validateUser(user)) {
        return {
          isError: true,
          data: "403",
        };
      }
      const fullUser = await this.userService.getUserByUsername(user.username);
      if (
        (await this.tokenRepo.count({
          where: { userId: fullUser.id },
        })) !== 1
      ) {
        const token = await this.tokenRepo.save({
          id: idGen(),
          userId: fullUser.id,
          tokenValue: await bcrypt.hash(user.username + new Date().toDateString(), 10),
          expiredAt: new Date(),
          role: fullUser.userType,
        });
        return {
          isError: false,
          data: token.tokenValue,
          role: fullUser.userType,
        };
      }
      const token = await this.tokenRepo.findOne({
        where: { userId: fullUser.id },
      });
      return {
        isError: false,
        data: token.tokenValue,
        role: token.role,
      };
    } catch (e) {
      console.log(e);
      return {
        isError: true,
        data: "403",
      };
    }
  }

  async validateToken(tokenValue: string, role?: "standard" | "premium" | "admin") {
    role = role ?? "standard";
    const token = await this.tokenRepo.find({
      where: { tokenValue, role },
    });
    return token ? true : false;
  }

  async getBasicByToken(token: string) {
    const { userId } = await this.tokenRepo.findOne({
      where: { tokenValue: token },
    });
    return this.userService.getBasic(userId);
  }

  async getUserByToken(token: string) {
    const { userId } = await this.tokenRepo.findOne({
      where: { tokenValue: token },
    });
    return this.userService.getUser(userId);
  }
}
