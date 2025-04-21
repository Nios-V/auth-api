import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  login() {
    return 'login';
  }

  async register(registerData: RegisterDTO) {
    try {
      const user = await this.usersService.findOneByEmail(registerData.email);
      if (user) {
        throw new ConflictException('User already exists');
      }

      //Hash password
      registerData.password = await bcryptjs.hash(registerData.password, 10);

      return await this.usersService.create(registerData);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
  }
}
