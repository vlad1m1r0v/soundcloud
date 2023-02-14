import { randomUUID as uuid } from 'crypto';
import { extname } from 'path';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

const HALF_MEGABYTE = 512 * 1024;
const uploadOptions = { bufferSize: HALF_MEGABYTE, maxBuffers: 20 };

interface UploadStreamProps {
  mimeType: string;
  fileExtension: string;
  stream: Readable;
  containerName: string;
}

@Injectable()
export class AzureBlobService {
  readonly azureConnection: string;

  constructor(private config: ConfigService) {
    this.azureConnection = this.config.get<string>('AZURE_CONNECTION_STRING');
  }

  getContainerClient(containerName: string): ContainerClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const containerClient = blobClientService.getContainerClient(containerName);
    return containerClient;
  }

  getBlobClient(fileName: string, containerName: string): BlockBlobClient {
    const containerClient = this.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(fileName);
    return blobClient;
  }

  async upload(
    file: Express.Multer.File,
    containerName: string,
  ): Promise<string> {
    const fileName = uuid() + extname(file.originalname);
    const blobClient = this.getBlobClient(fileName, containerName);
    await blobClient.uploadData(file.buffer);
    return blobClient.url;
  }

  async uploadStream({
    mimeType,
    fileExtension,
    containerName,
    stream,
  }: UploadStreamProps) {
    const blobClient = this.getBlobClient(
      uuid() + fileExtension,
      containerName,
    );
    try {
      await blobClient.uploadStream(
        stream,
        uploadOptions.bufferSize,
        uploadOptions.maxBuffers,
        { blobHTTPHeaders: { blobContentType: mimeType } },
      );
      return blobClient.url;
    } catch {
      throw new InternalServerErrorException('Internal server error occured');
    }
  }

  async delete(url: string, containerName: string) {
    const blobName = url.substring(url.lastIndexOf('/') + 1, url.length);
    const blobClient = this.getBlobClient(blobName, containerName);
    await blobClient.deleteIfExists();
  }
}
