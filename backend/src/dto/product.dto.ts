import { IsNotEmpty, IsString } from "class-validator";

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsNotEmpty()
  @IsString()
  description: string;
  products: any;
}