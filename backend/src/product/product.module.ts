import { Module } from "@nestjs/common";
import { ProductService } from "../product/product.service";
import { ShopService } from "../shop/shop.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product, Shop, User, ProductShop } from "../entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Shop, User, ProductShop])],
  providers: [ProductService, ShopService],
  controllers: [ProductController],
})
export class ProductModule {}
