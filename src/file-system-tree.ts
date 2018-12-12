 import fs from 'fs';

export default class FileSystemTree {
  private readonly path: string;
  private readonly recursive: boolean;
  private pathContents: Array<string> = [];

  constructor (mainPath: string, isRecursive: boolean) {
    this.path = mainPath;
    this.recursive = isRecursive;
  }

  toList(): Array<string> {
    return this.listContents(this.path, this.recursive);
  }

  private listContents = (path: string, recursive: boolean = true) : Array<string> =>  {
    try {
      const contents = fs.readdirSync(path);
      console.log(contents);
      if (recursive) {
        contents.forEach((folder) => {
          const folderPath = `${path}\\${folder}`;
          const folderStat = this.listStats(folderPath);
          this.pathContents.push(folder);
          if (folderStat.isDirectory()) {
            this.listContents(folderPath);
          }
        });
      }
      return this.pathContents;
    } catch (e) {
      return e;
    }
  }

  private listStats = (path: string) => {
    try {
      return fs.statSync(path);
    } catch (e) {
      return e;
    }
  }
}
