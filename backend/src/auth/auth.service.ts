import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos';
import { Users } from 'src/users/users.entity';
import { Repository, Not, IsNull } from 'typeorm';
import { JwtPayload, Tokens } from './types';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(dto: CreateUserDto) {
    const candidate = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (candidate) {
      throw new BadRequestException('User with such email already exists');
    }
    try {
      const hash = await argon.hash(dto.password);
      const entity = this.usersRepository.create({ ...dto, password: hash });
      const user = await this.usersRepository.save(entity);
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRtHash(user.id, tokens.refresh_token);
      const { password, hashedRT, ...rest } = user;
      return { ...tokens, user: rest };
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }

  async signinLocal(dto: SignInDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    const { password, hashedRT, ...rest } = user;
    return { ...tokens, user: rest };
  }

  async logout(userId: string) {
    await this.usersRepository.update(
      {
        id: userId,
        hashedRT: Not(IsNull()),
      },
      {
        hashedRT: null,
      },
    );
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRT) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRT, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.usersRepository.update({ id: userId }, { hashedRT: hash });
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
