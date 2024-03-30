import { Module } from "@nestjs/common";
import { ShopService } from "./shop.service";
import { ShopController } from "./shop.controller";
import { Shop } from "src/entity/shop.entity";
import { User } from "src/entity/users.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Shop, User])],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}
