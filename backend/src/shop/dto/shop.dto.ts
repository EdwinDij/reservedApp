import { IsNotEmpty, IsString } from "class-validator";

export class ShopDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly address: string;
}
