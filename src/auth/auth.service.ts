import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
          expiresIn: 60 * 15,
        }),
      this.jwtService.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
          expiresIn: 60 * 60 * 24 * 7,
        })
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash }
    });
  }

  async signupLocal(dto: AuthDTO): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: { email: dto.email, hash }
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal(dto: AuthDTO): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (!user) throw new ForbiddenException("Access Token denied");

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new UnauthorizedException("E-mail e/ou senha inválidos")

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  logout() { }

  refreshToken() { }
}
