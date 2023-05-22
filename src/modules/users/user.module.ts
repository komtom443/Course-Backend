import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "src/entities/user.entity";
import TokenModule from "../token/token.module";
import Token from "src/entities/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), forwardRef(() => TokenModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
