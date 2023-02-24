import * as sharp from 'sharp';

export const cropImage = async (imageBuffer: Buffer): Promise<Buffer> =>
  await sharp(imageBuffer).resize(300, 300).toBuffer();
