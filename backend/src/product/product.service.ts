import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductDto } from "../dto";
import { User, Shop, Product, ProductShop } from "../entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductShop)
    private productShopRepository: Repository<ProductShop>,
  ) {}

  async createProduct(productDto: ProductDto, userId: string, shopId: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException("Utilisateur non trouvé", HttpStatus.NOT_FOUND);
      }

      const shop = await this.shopRepository.findOne({
        where: { id: shopId, userId: userId },
      });

      if (!shop) {
        throw new HttpException("Magasin non trouvé", HttpStatus.NOT_FOUND);
      }

      //vérifier si le produit existe déjà dans le magasin
      const findProductByName = await this.productRepository.findOne({
        where: { name: productDto.name },
      });
      const findProductInShop = await this.productShopRepository.findOne({
        where: { product: findProductByName, shop: shop },
      });

      if (findProductByName !== null && findProductInShop !== null) {
        throw new HttpException(
          "Ce produit existe déjà dans ce magasin",
          HttpStatus.CONFLICT,
        );
      }

      //enregistrement du produit dans la table produit
      const product = await this.productRepository.save({
        name: productDto.name,
        price: productDto.price,
        description: productDto.description,
        shop: shop,
      });
      //enregistrement du produit dans le magasin via la table de liaison
      await this.productShopRepository.save({
        product: product,
        shop: shop,
      });

      return {
        message: "Produit créé avec succès",
        status: HttpStatus.CREATED,
        data: product,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Une erreur s'est produite",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async createProductInAllShop(productDto: ProductDto, userId: string) {
  //   const user = await this.usersRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new HttpException("Utilisateur non trouvé", HttpStatus.NOT_FOUND);
  //   }

  //   const shops = await this.shopRepository.find({
  //     where: { userId: userId },
  //   });

  //   if (!shops || shops.length === 0) {
  //     throw new HttpException(
  //       "Aucun magasin trouvé pour cet utilisateur",
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   const entityManager = this.productRepository.manager;

  //   try {
  //     await entityManager.transaction(
  //       async (transactionalEntityManager: EntityManager) => {
  //         for (const shop of shops) {
  //           const productExist = await transactionalEntityManager.findOne(
  //             Product,
  //             {
  //               where: { name: productDto.name, shops: shop },
  //             },
  //           );

  //           if (!productExist) {
  //             const product = transactionalEntityManager.create(Product, {
  //               ...productDto,
  //               shop: shop,
  //             });
  //             await transactionalEntityManager.save(product);
  //           }
  //         }
  //       },
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     throw new HttpException(
  //       "Une erreur s'est produite",
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }

  //   return {
  //     message: "Produit créé avec succès dans tous les magasins",
  //     status: HttpStatus.CREATED,
  //   };
  // }

  async getAllProduct(userId: string, shopId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException("Utilisateur non trouvé", HttpStatus.NOT_FOUND);
    }

    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new HttpException("Magasin non trouvé", HttpStatus.NOT_FOUND);
    }

    const allProducts = await this.productRepository.find({
      where: { shops: shop },
    });

    if (allProducts.length === 0) {
      throw new HttpException("Aucun produit trouvé", HttpStatus.NOT_FOUND);
    }

    return allProducts;
  }

  async getProductById(productId: string) {
    // const user = await this.usersRepository.findOne({ where: { id: userId } });
    // if (!user) {
    //   throw new HttpException("Utilisateur non trouvé", HttpStatus.NOT_FOUND);
    // }

    const productData = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!productData) {
      throw new HttpException("Produit non trouvé", HttpStatus.NOT_FOUND);
    }
    return productData;
  }

  async getProduct(shopId: string) {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new HttpException("Magasin non trouvé", HttpStatus.NOT_FOUND);
    }
  }
}
