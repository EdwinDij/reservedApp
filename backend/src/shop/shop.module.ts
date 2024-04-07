import { Module } from "@nestjs/common";
import { ShopService } from "./shop.service";
import { ShopController } from "./shop.controller";
import { Shop, User } from "src/entity/";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Shop, User])],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}
