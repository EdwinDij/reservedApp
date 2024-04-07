import { IsNotEmpty, IsString } from "class-validator";

export class ShopDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  address: string;
}
