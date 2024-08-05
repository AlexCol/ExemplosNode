import fs from 'fs';
import path from 'path';

export function getControllers(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file: string) => {
    const filePath = path.join(dir, file);
    const stats = fs.lstatSync(filePath);

    if (stats.isDirectory()) {
      fileList = getControllers(filePath, fileList);
    } else if (file.includes('.controller')) {
      fileList.push(path.resolve(filePath));
    }
  });

  return fileList;
}
