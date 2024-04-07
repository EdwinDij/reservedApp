import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductDto } from "../dto";
import { User, Shop, Product, ProductShop } from "../entity";
import { ShopService } from "../shop/shop.service";

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
    private readonly shopService: ShopService,
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

  async createProductInAllShop(productDto: ProductDto, userId: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException("Utilisateur non trouvé", HttpStatus.NOT_FOUND);
      }

      const shops = await this.shopRepository.find({
        where: { userId: userId },
      });

      if (shops.length === 0) {
        throw new HttpException("Aucun magasin trouvé", HttpStatus.NOT_FOUND);
      }

      //vérifier si le produit existe déjà dans le magasin
      const findProductByName = await this.productRepository.findOne({
        where: { name: productDto.name },
      });

      if (findProductByName !== null) {
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
      });

      //enregistrement du produit dans les magasins via la table de liaison
      await this.linkProductToAllShops(product, shops);

      return {
        message: "Produit créé avec succès dans tout les magasins",
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

  async linkProductToAllShops(product: Product, shops: Shop[]) {
    for (const shop of shops) {
      // 👈 boucle sur les magasins de l'user
      await this.productShopRepository.save({
        product: product,
        shop: shop,
      });
    }
  }

  async getAllProductByShop(shopId: string) {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new HttpException("Magasin non trouvé", HttpStatus.NOT_FOUND);
    }

    console.log("shopId", shopId);
    const products = await this.productRepository
      .createQueryBuilder("product")
      .innerJoin("product.productShops", "productShop")
      .where("productShop.shopId = :shopId", { shopId })
      .getMany();

    return products;
  }

  async getAllShopByProduct(productId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new HttpException("Produit non trouvé", HttpStatus.NOT_FOUND);
    }

    const shops = await this.shopRepository
      .createQueryBuilder("shop")
      .innerJoin("shop.productShops", "productShop")
      .where("productShop.productId = :productId", { productId })
      .getMany();

    return shops;
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

    return { product: productData, status: HttpStatus.OK };
  }

  async getAllProduct(userId: string) {
    try {
      const findShop = this.shopService.getAllShop(userId);
      if (!findShop) {
        const products = await this.productRepository.find();
        return { products, status: HttpStatus.OK };
      }

    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Une erreur s'est produite",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
