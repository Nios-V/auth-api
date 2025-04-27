import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRoleDTO {
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsString()
  @IsNotEmpty()
  description: string;
}
