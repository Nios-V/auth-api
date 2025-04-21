import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body()
    loginBody: LoginDTO,
  ) {
    return this.authService.login(loginBody);
  }

  @Post('register')
  register(
    @Body()
    registerBody: RegisterDTO,
  ) {
    return this.authService.register(registerBody);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(
    @Req()
    req: Request,
  ) {
    return `Hi ${req['user'].name}, your id is ${req['user'].sub}`;
  }
}
