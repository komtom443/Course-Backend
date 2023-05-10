import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Token from "src/entities/token.entity";
import TokenController from "./token.controller";
import TokenService from "./token.service";
import { UserModule } from "../users/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UserModule],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export default class TokenModule {}
