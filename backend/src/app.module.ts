import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ConfigModule } from "@nestjs/config";
import { User } from "./entity/users.entity";
import { ShopModule } from "./shop/shop.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./auth/constants";
import { Shop } from "./entity/shop.entity";

@Module({
  imports: [
    ShopModule,
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Shop],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
