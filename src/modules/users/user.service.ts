import { InjectRepository } from "@nestjs/typeorm";
import User from "src/entities/user.entity";
import { IsNull, Not, Repository } from "typeorm";
import UserCreateInput from "./dto/user-create-input.dto";
import { v4 as idGen } from "uuid";
import UserUpdateInput from "./dto/user-update-input.dto";
import Token from "src/entities/token.entity";
import * as bcrypt from "bcrypt";
import TokenCreateInput from "../token/dto/token-create-input.dto";

type getBasic = {};

export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
  ) {}

  async getUsers(sort?: "ASC" | "DESC") {
    return await this.userRepo.find({
      where: { deletedAt: IsNull() },
      order: { id: sort ? sort : "ASC" },
    });
  }

  async createUsers(user: UserCreateInput) {
    var resp: any[] = [];
    user.passwd = await bcrypt.hash(user.passwd, 10);

    resp.push({
      id: idGen(),
      avatarUrl: "https://via.placeholder.com/90x90.png/ffdf0f?text=" + user.lastName[0].toUpperCase,
      userType: "standard",
      ...user,
    });

    return this.userRepo.save(resp);
  }

  async getUserIdByUsername(username: string) {
    const { id } = await this.userRepo.findOne({
      where: { username },
    });
    return id;
  }
  async updateUsers(users: UserUpdateInput[]) {
    var resp: any[] = [];
    users.forEach(user => {
      resp.push({
        ...user,
      });
    });
    return this.userRepo.save(resp);
  }

  async getBasic(tokenValue: string) {
    const userId = (
      await this.tokenRepo.findOne({
        select: ["userId"],
        where: {
          tokenValue,
        },
      })
    ).tokenValue;
    return await this.userRepo.findOne({
      select: ["firstName", "lastName", "avatarUrl", "email"],
      where: { id: userId },
    });
  }

  async validateUser({ username, passwd }: TokenCreateInput) {
    try {
      const user = await this.userRepo.findOne({
        where: { username },
      });
      return await bcrypt.compare(passwd, user.passwd);
    } catch {
      return false;
    }
  }
}
