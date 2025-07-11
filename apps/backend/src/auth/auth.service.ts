/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { type User } from '@repo/database';
import {
  isPossiblePhoneNumber,
  RegisterSchemaType,
  validatePhoneNumber,
} from '@repo/shared-types';
import * as argon from 'argon2';
import { type Request, type Response } from 'express';
import { UserService } from 'src/user/user.service';
import { TokenPayload } from '@repo/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerData: RegisterSchemaType) {
    const { name, password, surname, email, phone } = registerData;
    const phoneValue = phone?.trim();
    const emailValue = email?.trim();

    // Telefon numarası kontrolü
    if (phoneValue && phoneValue !== '') {
      const phoneValidation = validatePhoneNumber(phoneValue);

      // Telefon geçersizse hata fırlat
      if (!phoneValidation.isValid && !phoneValidation.isEmpty) {
        throw new BadRequestException(phoneValidation.error);
      }

      // Telefon geçerliyse, daha önce kullanılıp kullanılmadığını kontrol et
      if (phoneValidation.isValid) {
        const isUserPhoneExists = await this.userService.getUserUnique({
          where: { phone: phoneValue },
        });
        if (isUserPhoneExists) {
          throw new BadRequestException(
            'Bu telefon numarası zaten kayıtlı. Lütfen başka bir telefon numarası deneyin.',
          );
        }
      }
    }

    // Email kontrolü
    if (emailValue && emailValue !== '') {
      const isUserEmailExists = await this.userService.getUserUnique({
        where: { email: emailValue.toLowerCase() },
      });
      if (isUserEmailExists) {
        throw new BadRequestException(
          'Bu email adresi zaten kayıtlı. Lütfen başka bir email adresi deneyin.',
        );
      }
    }

    // Şifreyi hashle
    const hashedPassword = await this.hashPassword(password);

    // Kullanıcıyı oluştur
    const newUser = await this.userService.createUser({
      create: {
        name: name.trim(),
        surname: surname.trim(),
        email: emailValue ? emailValue.toLowerCase() : null,
        phone:
          phoneValue && validatePhoneNumber(phoneValue).isValid
            ? phoneValue
            : null,
        password: hashedPassword,
        role: 'USER',
        verifiedUser: false,
      },
    });

    // Şifreyi response'dan çıkar ve kullanıcı bilgilerini döndür
    const { password: userPassword, ...result } = newUser;

    return {
      success: true,
      message: 'Kullanıcı başarıyla kayıt edildi',
      user: result,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon.hash(password);
    return hashedPassword;
  }

  async compare(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    const isMatch = await argon.verify(hashedPassword, plainPassword);
    return isMatch;
  }

  async validateUser(username: string, password: string) {
    const isMaybePhone = isPossiblePhoneNumber(username);
    let user: User | null = null;
    if (isMaybePhone) {
      user = await this.userService.getUserUnique({
        where: {
          phone: username,
        },
      });
    } else if (!isMaybePhone) {
      user = await this.userService.getUserUnique({
        where: {
          email: username,
        },
      });
    }
    if (!user || !user.password) {
      return null;
    }
    const isMatch = await this.compare(user.password, password);
    if (!isMatch) {
      return null;
    }
    const { password: userPass, ...result } = user;
    return result;
  }

  async login(user: User, response: Response) {
    const expireAccessToken = new Date();
    expireAccessToken.setTime(
      expireAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const expireRefreshToken = new Date();
    expireRefreshToken.setTime(
      expireRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const tokenPayload: TokenPayload = {
      emailVerified: false,
      id: user.id,
      ...(user.email ? { email: user.email } : {}),
      ...(user.phone ? { phone: user.phone } : {}),
      name: user.name,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_ACCESS_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    await this.userService.updateUser({
      where: { id: user.id },
      data: { refreshToken: await this.hashPassword(refreshToken) },
    });

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expireAccessToken,
    });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expireRefreshToken,
    });
  }

  async verifyUserRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.userService.getUserUnique({
        where: { id: userId },
      });
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException();
      }
      const isMatch = await this.compare(user.refreshToken, refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Geçersiz refresh token');
      }
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Refresh token doğrulama hatası');
    }
  }
  me(req: Request): TokenPayload | null {
    const token = req.cookies.access_token || null;
    if (!token) {
      return null;
    }
    const payload = this.jwtService.decode(token) as TokenPayload;
    return payload;
  }
}
