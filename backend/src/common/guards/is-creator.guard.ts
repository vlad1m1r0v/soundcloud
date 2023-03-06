import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/types';
import { ErrorMessage } from 'src/common/enums';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class IsCreator implements CanActivate {
  constructor(
    @InjectDataSource() private entityManager: EntityManager,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const repository = this.reflector.get<string>(
      'repository',
      context.getHandler(),
    );
    const { user, params }: { user: JwtPayload; params: { id: string } } =
      request;
    const userId = user.sub;
    const entityId = params.id;
    const entity = await this.entityManager.query(
      `SELECT * FROM ${repository} WHERE id = '${entityId}' AND user_id = '${userId}'`,
    );
    if (entity.length) return true;
    throw new ForbiddenException(ErrorMessage.ACCESS_DENIED);
  }
}
