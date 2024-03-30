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
} from "@nestjs/common";

@Controller("shop")
export class ShopController {
  constructor(private readonly ShopService: ShopService) { }
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

  // shopDto: import("c:/Users/Millenium/Documents/workflow/reserved/backend/src/shop/dto/shop.dto").ShopDtoshopDto: import("c:/Users/Millenium/Documents/workflow/reserved/backend/src/shop/dto/shop.dto").ShopDto  @Delete("/:id")
  //   async deleteShop(id: string) {
  //     return this.ShopService.deleteShop(id);
  //   }

  //   @Patch("/:id")
  //   async patchShop(id: string) {
  //     return this.ShopService.patchShop(id);
  //   }
}
