import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly JwtService: JwtService,
  ) {}

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

      const payload = {
        email: user.email,
        sub: user.id,
        name: user.name,
        role: user.role,
      };
      const token = this.JwtService.sign(payload);

      return token;
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
