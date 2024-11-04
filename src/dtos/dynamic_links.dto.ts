import { IsString } from "class-validator";

export class DynamicLinksDto {
  @IsString()
  link: string;

  @IsString()
  apn: string;

  @IsString()
  isi: string;

  @IsString()
  ibi: string;

  @IsString()
  token: string;
}