import { Readable } from 'stream';

export const bufferToStream = (buffer: Buffer) => Readable.from(buffer);
