import {
  Controller,
  Post,
  Body,
  Patch,
  ParseArrayPipe,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AssignRolesDTO } from './dto/assign-roles.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id/roles')
  @Auth([Role.ADMIN])
  updateUserRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body('roles', ParseArrayPipe) dto: AssignRolesDTO,
  ) {
    return this.usersService.assignRoles(id, dto.roles);
  }
}
