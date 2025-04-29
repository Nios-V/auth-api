import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDTO } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() roleData: CreateRoleDTO) {
    return await this.rolesService.create(roleData);
  }

  @Get()
  async getAllRoles() {
    return await this.rolesService.findAll();
  }

  @Get('/:id')
  async getRoleById(@Param('id') id: number) {
    return await this.rolesService.findById(id);
  }

  @Get('/:name')
  async getRoleByName(@Param('name') name: string) {
    return await this.rolesService.findOneByName(name);
  }
}
