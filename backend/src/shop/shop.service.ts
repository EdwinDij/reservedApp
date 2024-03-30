import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../entity/users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Shop } from "../entity/shop.entity";
import { ShopDto } from "./dto/shop.dto";

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  // async getAllShop(userId: string){
  //   try {
  //     const user = await this.usersRepository.findOne({
  //       where: { id: userId },
  //     });

  //     if (!user) {
  //       throw new NotFoundException(
  //         `Utilisateur avec l'ID ${userId} non trouvé`,
  //       );
  //     }
  //   } catch (error: unknown) {
  //     console.log(error);
  //   }
  // }

  async createShop(shopDto: ShopDto, userId: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(
          `Utilisateur avec l'ID ${userId} non trouvé`,
        );
      }
      await this.shopRepository.save({
        name: shopDto.name,
        address: shopDto.address,
        userId: userId,
      });
      return "magasin créé avec succès";
    } catch (error: unknown) {
      console.log(error);
    }
  }
}
