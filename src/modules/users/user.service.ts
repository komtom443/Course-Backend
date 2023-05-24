import { InjectRepository } from "@nestjs/typeorm";
import User from "src/entities/user.entity";
import { IsNull, Not, Repository, SelectQueryBuilder } from "typeorm";
import UserCreateInput from "./dto/user-create-input.dto";
import { v4 as idGen } from "uuid";
import UserUpdateInput from "./dto/user-update-input.dto";
import Token from "src/entities/token.entity";
import * as bcrypt from "bcrypt";
import TokenCreateInput from "../token/dto/token-create-input.dto";
import TokenService from "../token/token.service";
import { Inject, Injectable, forwardRef } from "@nestjs/common";

type getBasic = {};
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,

    @Inject(forwardRef(() => TokenService))
    private tokenService: TokenService,
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
      avatarUrl: "https://via.placeholder.com/90x90.png/ffdf0f?text=" + user.lastName[0].toUpperCase(),
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
      select: ["firstName", "lastName", "username", "email", "phone", "avatarUrl", "userType"],
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

  async checkEmail(email: string) {
    return (
      (await this.userRepo.count({
        where: { email },
      })) === 0
    );
  }

  async getUser(id: string) {
    return this.userRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async getTeacher(token) {
    return this.userRepo.find({
      // where: { userType: "premium" },
    });
  }

  async getUsersAdmin(token: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    const users: any = await this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.courses", "student_course")
      .leftJoinAndSelect("student_course.course", "course")
      .where("user.deletedAt IS NULL")
      .orderBy("user.firstName")
      .getMany();
    return users;
  }

  async getUserAdmin(token: string, userId: string) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    const user: User = await this.userRepo.createQueryBuilder("user").where("user.deletedAt IS NULL").andWhere("user.id =:userId", { userId }).getOne();
    let userQuery: SelectQueryBuilder<User> = await this.userRepo
      .createQueryBuilder("user")
      .where("user.deletedAt IS NULL")
      .andWhere("user.id =:userId", { userId })
      .select(["user.firstName", "user.lastName", "user.phone", "user.email", "user.username", "user.userType", "user.avatarUrl"]);
    if (user.userType === "standard") {
      return userQuery.leftJoinAndSelect("user.courses", "student_course").leftJoinAndSelect("student_course.course", "course").getOne();
    }
    if (user.userType === "teacher") {
      return await userQuery.leftJoinAndSelect("user.coursesTaught", "course").getOne();
    }
    return userQuery.getOne();
  }

  async updateUsersAdmin(token: string, users: Array<{ id: string; userType: "standard" | "teacher" | "admin" }>) {
    if (!(await this.tokenService.validateToken(token, "admin"))) {
      return { error: "Lỗi xác thực tài khoản" };
    }
    for (let i = 0; i < users.length; i++) {
      this.tokenRepo.save({
        ...(await this.tokenRepo.findOne({ where: { userId: users[i].id } })),
        role: users[i].userType,
      });
    }

    return await this.userRepo.save(users);
  }
}
