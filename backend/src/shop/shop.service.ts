import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { User, Shop } from "../entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ShopDto } from "../dto";

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  async getAllShop(userId: string) {
    try {
      const shop = await this.shopRepository.find({
        where: { userId: userId },
      });

      if (!shop) {
        throw new NotFoundException("Aucun magasin trouvé");
      }
      return shop;
    } catch (error: unknown) {
      console.log(error);
      throw new InternalServerErrorException(
        "Une erreur s'est produite lors de la récupération des magasins.",
      );
    }
  }

  async getShopById(id: string, userId: string) {
    try {
      const shop = await this.shopRepository.findOne({
        where: { id: id, userId: userId },
      });
      if (!shop) {
        throw new NotFoundException(`Magasin avec l'ID ${id} non trouvé`);
      }
      return shop;
    } catch (error: unknown) {
      console.log(error);
      throw new InternalServerErrorException(
        "Une erreur s'est produite lors de la récupération du magasin.",
      );
    }
  }

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
      const shopExist = await this.shopRepository.findOne({
        where: { name: shopDto.name },
      });
      if (shopExist) { //TODO: check si c'est utile ou pas d'utilisé findOne
        throw new NotFoundException(
          `Le magasin ${shopDto.name} existe déjà à l'adresse ${shopDto.address}`,
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

  async deleteShop(id: string, userId: string) {
    try {
      const shop = await this.shopRepository.findOne({
        where: { id: id, userId: userId },
      });
      console.log(shop);
      if (!shop) {
        throw new NotFoundException(`Magasin avec l'ID ${id} non trouvé`);
      }
      await this.shopRepository.delete(id);
      return "Magasin supprimé avec succès";
    } catch (error: unknown) {
      console.log(error);
    }
  }

  async patchShop(id: string, userId: string, shopDto: ShopDto) {
    try {
      const shop = await this.shopRepository.findOne({
        where: { id: id, userId: userId }, //double vérification pour s'assurer que le magasin appartient à l'utilisateur et l'user existe
      });
      if (!shop) {
        throw new NotFoundException(`Magasin avec l'ID ${id} non trouvé`);
      }

      const { name, address } = shopDto;
      if (!name && !address) {
        return "Aucun champ à mettre à jour n'a été fourni.";
      }

      const updateData: Partial<ShopDto> = {};

      if (name !== shop.name) {
        //si le nom est différent de celui enregistré en base de données alors on met à jour le nom
        shop.name = name;
        updateData.name = name;
      }

      if (address !== shop.address) {
        //pareil mais pour l'adresse
        shop.address = address;
        updateData.address = address;
      }

      if (Object.keys(updateData).length > 0) {
        //on vérifie si des modifications ont été apportées
        await this.shopRepository.update(id, updateData);
        return "Magasin mis à jour avec succès";
      } else {
        return "Aucune modification n'a été apportée";
      }
    } catch (error: unknown) {
      console.log(error);
      throw new InternalServerErrorException(
        "Une erreur s'est produite lors de la mise à jour du magasin.",
      );
    }
  }
}
