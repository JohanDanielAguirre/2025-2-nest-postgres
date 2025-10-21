import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from './decorators/auth-decorator';
import { ValidRoles } from './enums/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }

  @Get('private')
  @Auth(ValidRoles.USER)
  testPrivate() {
    //console.log("🚀 ~ :29 ~ AuthController ~ testPrivate ~ user:", user)
    return {
      ok: true,
      message: 'logged in',
    };
  }
}
