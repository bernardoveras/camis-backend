import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('local/signup')
  signupLocal(@Body() dto: AuthDTO): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Post('local/signin')
  signinLocal(@Body() dto: AuthDTO): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('refresh')
  refreshToken() {
    return this.authService.refreshToken();
  }
}
