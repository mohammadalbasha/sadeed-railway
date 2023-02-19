import { UnsupportedMediaTypeException } from '@nestjs/common';

export function fileFilter(mimetypes: string[], maxSize:number = 1000000) {
  return (
    req,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (file.size>maxSize) {
        callback(
            new UnsupportedMediaTypeException(
              `File size is bigger than: ${maxSize}`,
            ),
            false,
          );
    }

    if (!mimetypes.some((m) => file.mimetype.includes(m))) {
        callback(
            new UnsupportedMediaTypeException(
              `File type is not matching: ${mimetypes.join(', ')}`,
            ),
            false,
          );
    } 

    const fileExtension = file.originalname.split('.').pop()
    if (!mimetypes.some((m) => fileExtension.includes(m))) {
        callback(
            new UnsupportedMediaTypeException(
              `File type is not matching: ${mimetypes.join(', ')}`,
            ),
            false,
          );
    }

    callback(null, true);
  };
}
