import {
  Controller,
  UseGuards,
  Get,
  Req,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { AuthGuard } from "src/auth/auth.guard";
import { ProductDto } from "src/dto";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post("/:shopId") // création d'un produit dans un magasin
  async createProduct(
    @Body() productDto: ProductDto,
    @Req() req,
    @Param("shopId") shopId: string,
  ) {
    const userId = req.user.sub;
    return this.productService.createProduct(productDto, userId, shopId);
  }

  @UseGuards(AuthGuard)
  @Post("/") // création d'un produit dans tout les magasins
  async createProductInAllShop(@Body() productDto: ProductDto, @Req() req) {
    const userId = req.user.sub;
    return this.productService.createProductInAllShop(productDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get("/:productId") // récupération d'un produit par son id
  async getProductById(
    @Param("productId") productId: string, // 👈 meme logique pour l'update et la suppression
  ) {
    return this.productService.getProductById(productId);
  }

  @UseGuards(AuthGuard)
  @Get("/:shopId") // récupération de tout les produits d'un magasin
  async getAllProductByShop(@Param("shopId") shopId: string) {
    return this.productService.getAllProductByShop(shopId);
  }

  @UseGuards(AuthGuard)
  @Get("shop/:productId") // récupération de tout les magasins d'un produit
  async getAllShopByProduct(@Param("productId") productId: string) {
    return this.productService.getAllShopByProduct(productId);
  }

  @UseGuards(AuthGuard)
  @Get("/") // récupération de tout les produits
  async getAllProduct(@Req() req) {
    const userId = req.user.sub;
    return this.productService.getAllProduct(userId);
  }

  @UseGuards(AuthGuard)
  @Delete("/:productId") // suppression d'un produit dans tout les magasins
  async deleteProduct(@Param("productId") productId: string) {
    return this.productService.deleteProductForAllShop(productId);
  }

  @UseGuards(AuthGuard)
  @Delete("/:productId/:shopId") // suppression d'un produit dans un magasin
  async deleteProductByShop(
    @Param("productId") productId: string,
    @Param("shopId") shopId: string,
  ) {
    return this.productService.deleteProductByShop(productId, shopId);
  }

  @UseGuards(AuthGuard)
  @Patch("disable/:productId/:shopId") // desactivation et activé d'un produit
  async disableOrEnsableProduct(
    @Param("productId") productId: string,
    @Param("shopId") shopId: string,
  ) {
    return this.productService.disableOrEnsableProductByShop(productId, shopId);
  }
  @UseGuards(AuthGuard)
  @Patch("modifyProduct/:productId") // modification d'un produit
  async modifyProduct(
    @Body() productDto: ProductDto,
    @Param("productId") productId: string,
  ) {
    return this.productService.modifyProduct(productDto, productId);
  }
}
