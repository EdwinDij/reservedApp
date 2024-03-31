import { AuthGuard } from "src/auth/auth.guard";
import { ShopDto } from "./dto/shop.dto";
import { ShopService } from "./shop.service";
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Req,
  Body,
  Param,
} from "@nestjs/common";

@Controller("shop")
export class ShopController {
  constructor(private readonly ShopService: ShopService) {}
  // @Get("/:id") //mettre l'id de l'user en paramètre
  // async getAllShop(id: string) {
  //   return this.ShopService.getAllShop(id);
  // }

  //   @Get("/:id") //mettre l'id du shop en paramètre
  //   async getShopById(id: string) {
  //     return this.ShopService.getShopById(id);
  //   }

  @UseGuards(AuthGuard)
  @Post("/")
  async createShop(@Body() shopDto: ShopDto, @Req() req) {
    const userId = req.user.sub;
    return this.ShopService.createShop(shopDto, userId);
  }

  //   // @Put("/:id")
  //   // async updateShop(id: string) {
  //   //     return this.ShopService.updateShop(id);
  //   // }
  @UseGuards(AuthGuard)
  @Delete("/:id")
  async deleteShop(@Param("id") id: string, @Req() req) {
    const userId = req.user.sub;
    console.log(id, "id");
    return this.ShopService.deleteShop(id, userId);
  }

  @UseGuards(AuthGuard)
  @Patch("/:id")
  async patchShop(
    @Param("id") id: string,
    @Req() req,
    @Body() shopDto: ShopDto,
  ) {
    const userId = req.user.sub;
    return this.ShopService.patchShop(id, userId, shopDto);
  }
}
