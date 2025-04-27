import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(roleData: CreateRoleDTO) {
    try {
      return this.roleRepository.save(roleData);
    } catch (error) {
      throw new HttpException(`Error creating role: ${error.message}`, 500);
    }
  }

  async findOneByName(name: string) {
    try {
      const role = this.roleRepository.findOne({ where: { name } });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return role;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Error finding role: ${error.message}`, 500);
      }
    }
  }

  async findById(id: number) {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return role;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Error finding role: ${error.message}`, 500);
      }
    }
  }

  async findAll() {
    try {
      const roles = await this.roleRepository.find();
      if (!roles || roles.length === 0) {
        throw new NotFoundException('Role not found');
      }
      return roles;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(`Error finding roles: ${error.message}`, 500);
      }
    }
  }
}
