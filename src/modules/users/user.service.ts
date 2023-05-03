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

  async getUserByUsername(username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
    });
    return user;
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

  async getBasic(id: string) {
    return await this.userRepo.findOne({
      where: { id },
      select: ["firstName", "lastName", "username", "email", "phone"],
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

  async checkUsername(username: string) {
    return (
      (await this.userRepo.count({
        where: { username },
      })) === 0
    );
  }

  async getUser(id: string) {
    return this.userRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }
}
