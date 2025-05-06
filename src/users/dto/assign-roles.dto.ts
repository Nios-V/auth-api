import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class AssignRolesDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  roles: number[];
}
