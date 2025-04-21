import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginData: LoginDTO) {
    try {
      const user = await this.usersService.findOneByEmail(loginData.email);

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      //Check password
      const isPasswordValid = await bcryptjs.compare(
        loginData.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new HttpException('Invalid password', 401);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
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
