import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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
        { sub: userId, email },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
          expiresIn: '15m',
        }),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
          expiresIn: '7d',
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

    const user = await this.prisma.user.create({
      data: { email: dto.email, hash }
    }).catch((error) => {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Credenciais incorretas');

      }
      throw error;
    });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal(dto: AuthDTO): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (!user) throw new ForbiddenException("Access Denied");

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new UnauthorizedException("E-mail e/ou senha inválidos")

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: { not: null }
      },
      data: {
        hashedRt: null,
      }
    });
    return true;
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.hashedRt) throw new ForbiddenException("Access Denied");

    const matches = await bcrypt.compare(refreshToken, user.hashedRt);
    if (!matches) throw new ForbiddenException("Access Denied");

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
