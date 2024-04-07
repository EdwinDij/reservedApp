import {
  Controller,
  UseGuards,
  Get,
  Req,
  Post,
  Body,
  Param,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { AuthGuard } from "src/auth/auth.guard";
import { ProductDto } from "src/dto";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //   @UseGuards(AuthGuard)
  //   @Get("/")
  //   async getAllProduct(@Req() req){
  //     const userId = req.user.sub;
  //     return this.productService.getAllProduct(userId)
  //   }

  @UseGuards(AuthGuard)
  @Post("/:shopId")
  async createProduct(
    @Body() productDto: ProductDto,
    @Req() req,
    @Param("shopId") shopId: string,
  ) {
    const userId = req.user.sub;
    return this.productService.createProduct(productDto, userId, shopId);
  }

  @UseGuards(AuthGuard)
  @Get("/:shopId")
  async getAllProdduct(@Req() req, @Param("shopId") shopId: string) {
    const userId = req.user.sub;
    return this.productService.getAllProduct(userId, shopId);
  }

  @UseGuards(AuthGuard)
  @Get("/:shopId/:productId")
  async getProductById(
    @Req() req,
    @Param("shopId") shopId: string,
    @Param("productId") productId: string,
  ) {
    const userId = req.user.sub;
    return this.productService.getProductById(userId, shopId, productId);
  }
}
