import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product, Shop, User } from "src/entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Shop, User])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
