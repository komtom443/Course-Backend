import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import UserCreateInput from './dto/user-create-input.dto';
import { v4 as idGen } from 'uuid';
import UserUpdateInput from './dto/user-update-input.dto';

type getBasic = {};

export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getUsers(sort?: 'ASC' | 'DESC') {
    return await this.userRepo.find({
      where: { deletedAt: IsNull() },
      order: { id: sort ? sort : 'ASC' },
    });
  }

  async createUsers(users: UserCreateInput[]) {
    var resp: any[] = [];
    users.forEach((user) => {
      resp.push({
        id: idGen(),
        ...user,
      });
    });
    return this.userRepo.save(resp);
  }

  async updateUsers(users: UserUpdateInput[]) {
    var resp: any[] = [];
    users.forEach((user) => {
      resp.push({
        ...user,
      });
    });
    return this.userRepo.save(resp);
  }

  async getBasic(userToken: string) {
    aw;
  }
}
