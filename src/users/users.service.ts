import { Injectable } from '@nestjs/common';
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
    return this.userRepository.findOne({ where: { email } });
  }
}
