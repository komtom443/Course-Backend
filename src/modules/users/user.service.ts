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
  ) {}

  async getUsers(sort?: "ASC" | "DESC") {
    return await this.userRepo.find({
      where: { deletedAt: IsNull() },
      order: { id: sort ? sort : "ASC" },
    });
  }

  async createUsers(users: UserCreateInput[]) {
    var resp: any[] = [];
    for (const user of users) {
      user.passwd = await bcrypt.hash(user.passwd, 10);

      resp.push({
        id: idGen(),
        ...user,
      });
      console.log(resp);
    }
    console.log("KOM");

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

  async getBasic(userToken: string) {}

  async validateUser({ username, passwd }: TokenCreateInput) {
    const user = await this.userRepo.findOne({
      where: { username },
    });
    if (!user) {
      return false;
    }
    return await bcrypt.compare(passwd, user.passwd);
  }
}
