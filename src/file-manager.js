import fs from 'fs';
import { promisify } from 'util';

class File {
  static async listContents(path, recursive = true) {
    try {
      const readdir = promisify(fs.readdir);
      const contents = await readdir(path).then(content => content);

      if (recursive) {
        contents.forEach(async (folder) => {
          const folderPath = `${path}\\${folder}`;
          const folderStat = await this.listStats(folderPath);
          // TO DO
          if (folderStat.isDirectory()) {
            await this.listContents(folderPath);
          }
        });
      }
      return contents;
    } catch (e) {
      return e;
    }
  }

  static async listStats(path) {
    try {
      const stat = promisify(fs.stat);
      const contents = await stat(path).then(content => content);
      return contents;
    } catch (e) {
      return e;
    }
  };
}

export default File;
