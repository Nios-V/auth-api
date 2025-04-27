import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { Role } from './enums/role.enum';
import { Auth } from './decorators/auth.decorator';

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
  @Auth(Role.USER)
  me(
    @Req()
    req: Request,
  ) {
    return `Hi ${req['user'].name}, your id is ${req['user'].sub}`;
  }

  @Get('admin/dashboard')
  @Auth(Role.ADMIN)
  adminDashboard(
    @Req()
    req: Request,
  ) {
    return `This is the admin dashboard, ${req['user'].name}`;
  }

  @Get('editor/tasks')
  @Auth(Role.EDITOR)
  editorTasks(
    @Req()
    req: Request,
  ) {
    return `These are your tasks, ${req['user'].name}`;
  }
}
