import { SetMetadata } from '@nestjs/common';

export const Repository = (repository: string) =>
  SetMetadata('repository', repository);
