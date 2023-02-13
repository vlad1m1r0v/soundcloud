import { randomUUID as uuid } from 'crypto';
import { extname } from 'path';
import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureBlobService {
  readonly azureConnection: string;

  constructor(private config: ConfigService) {
    this.azureConnection = this.config.get<string>('AZURE_CONNECTION_STRING');
  }

  getBlobClient(imageName: string, containerName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const containerClient = blobClientService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async upload(
    file: Express.Multer.File,
    containerName: string,
  ): Promise<string> {
    const imgUrl = uuid() + extname(file.originalname);
    const blobClient = this.getBlobClient(imgUrl, containerName);
    await blobClient.uploadData(file.buffer);
    return blobClient.url;
  }
}
