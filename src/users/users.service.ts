import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { roles: rolesIds, ...userData } = createUserDto;
    const roles = await this.roleService.findByIds(rolesIds);
    console.log(roles);
    const user = this.userRepository.create({
      ...userData,
      roles,
    });
    return this.userRepository.save(user);
  }
  async findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async assignRoles(id: number, roleIds: number[]) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const roles = await this.roleService.findByIds(roleIds);

      if (roles.length === 0) {
        throw new NotFoundException('Roles not found');
      }

      user.roles = roles;
      return this.userRepository.save(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          `Failed assigning roles: ${error.message}`,
          500,
        );
      }
    }
  }
}
