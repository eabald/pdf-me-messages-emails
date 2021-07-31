import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class EmailWithTokenDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
