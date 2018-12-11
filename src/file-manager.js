import fs from 'fs';

class File {
  static listContents(path, recursive = true) {
    try {
      const contents = fs.readdirSync(path);

      if (recursive) {
        contents.forEach(async (folder) => {
          const folderPath = `${path}\\${folder}`;
          const folderStat = this.listStats(folderPath);
          // TO DO
          if (folderStat.isDirectory()) {
            this.listContents(folderPath);
          }
        });
      }

      return contents;
    } catch (e) {
      return e;
    }
  }

  static listStats(path) {
    try {
      return fs.statSync(path);
    } catch (e) {
      return e;
    }
  }
}

export default File;
