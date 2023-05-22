import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "ormconfig";
import { UserModule } from "./modules/users/user.module";
import TokenModule from "./modules/token/token.module";
import CourseModule from "./modules/course/course.module";
import CategoryModule from "./modules/category/category.module";
import LessonModule from "./modules/lesson/lesson.module";
@Module({
  imports: [
    UserModule,
    TokenModule,
    LessonModule,
    CourseModule,
    CategoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
