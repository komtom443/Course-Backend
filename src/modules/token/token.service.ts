import { InjectRepository } from "@nestjs/typeorm";
import Token from "src/entities/token.entity";
import { Repository } from "typeorm";
import { UserService } from "../users/user.service";
import TokenCreateInput from "./dto/token-create-input.dto";
import { v4 as idGen } from "uuid";
import * as bcrypt from "bcrypt";
import { Inject, forwardRef } from "@nestjs/common";

export default class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,

    @Inject(forwardRef(() => UserService))
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
          expiredAt: new Date(new Date().getTime() + 1800000),
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
      await this.tokenRepo.save({
        ...token,
        role: fullUser.userType,
        expiredAt: new Date(new Date().getTime() + 1800000),
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

  // Hàm xác thực token

  async validateToken(tokenValue: string, role?: "standard" | "teacher" | "admin") {
    const token = await this.tokenRepo.findOne({
      where: { tokenValue, ...(role ? { role } : {}) },
    });
    if (!token) {
      return false;
    }
    if (token.isRemember) {
      return true;
    }

    if (new Date().getTime() < new Date(token.expiredAt).getTime()) {
      await this.tokenRepo.save({ ...token, expiredAt: new Date(new Date().getTime() + 1800000) });
      return true;
    }
    return false;
  }

  // ........................

  async getBasicByToken(token: string) {
    if (!(await this.validateToken(token))) {
      return;
    }
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

  async getRole(token: string) {
    if (!(await this.validateToken(token))) {
      return { isError: true };
    }
    const { role } = await this.tokenRepo.findOne({
      where: { tokenValue: token },
    });
    return role;
  }
}
