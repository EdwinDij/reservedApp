import { Injectable } from "@nestjs/common";
import { User, Shop, Product } from "../entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductDto } from "../dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async createProduct(productDto: ProductDto, userId: string, shopId: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        return { message: "Utilisateur non trouvé", status: 404 };
      }

      const shop = await this.shopRepository.findOne({
        where: { id: shopId },
      });

      if (!shop) {
        return { message: "Magasin non trouvé", status: 404 };
      }
      const productExist = await this.productRepository.findOne({
        where: { name: productDto.name, shop: shop },
      })

      if (productExist) {
        return { message: "Produit déjà existant", status: 400 };
      }

      await this.productRepository.save({
        name: productDto.name,
        price: productDto.price,
        description: productDto.description,
        shop: shop,
      })
      return { message: "Produit créé avec succès", status: 201 };

    } catch (error: unknown) {
      console.log(error);
      return { message: "Une erreur s'est produite", status: 500 };
    }
  }

  async getAllProduct(userId: string, shopId: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        return { message: "Utilisateur non trouvé", status: 404 };
      }

      const shop = await this.shopRepository.findOne({
        where: { id: shopId },
      });
      if (!shop) {
        return { message: "Magasin non trouvé", status: 404 };
      }
      const allProducts = await this.productRepository.find({
        where: { shop: shop },
      });

      if (allProducts.length === 0) {
        return { message: "Aucun produit trouvé", status: 404 };
      }

      return allProducts;
    } catch (error: unknown) {
      console.log(error);
      return { message: "Une erreur s'est produite", status: 500 };
    }
  }

  async getProductById(userId: string, shopId: string, productId: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        return { message: "Utilisateur non trouvé", status: 404 };
      }

      const shop = await this.shopRepository.findOne({
        where: { id: shopId },
      });
      if (!shop) {
        return { message: "Magasin non trouvé", status: 404 };
      }

      const product = await this.productRepository.findOne({
        where: { id: productId, shop: shop },
      });

      if (!product) {
        return { message: "Produit non trouvé", status: 404 };
      }

      return product;
    } catch (error: unknown) {
      console.log(error);
      return { message: "Une erreur s'est produite", status: 500 };
    }
  }
}
