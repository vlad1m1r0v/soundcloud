import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/auth/types';
import { ErrorMessage } from 'src/common/enums';
import { Repository } from 'typeorm';
import { Music } from './music.entity';

@Injectable()
export class MusicCreatorGuard implements CanActivate {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { user, params }: { user: JwtPayload; params: { id: string } } =
        request;
      const userId = user.sub;
      const musicId = params.id;
      await this.musicRepository.findOneOrFail({
        where: {
          id: musicId,
          user: {
            id: userId,
          },
        },
      });
      return true;
    } catch {
      throw new ForbiddenException(ErrorMessage.ACCESS_DENIED);
    }
  }
}
