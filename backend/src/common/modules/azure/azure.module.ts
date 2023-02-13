import { Module } from '@nestjs/common';
import { AzureBlobService } from './azure.service';

@Module({
  providers: [AzureBlobService],
  controllers: [],
  exports: [AzureBlobService],
})
export class AzureModule {}
