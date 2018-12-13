import fs from 'fs';
import TreeFolder from './tree-folder';
import TreeFile from './tree-file';

export default class Tree {
  private readonly path: string;
  private readonly recursive: boolean;
  private pathContents?: TreeFolder;

  constructor(path: string, recursive: boolean) {
    this.path = path;
    this.recursive = recursive;
    this.pathContents = new TreeFolder(path);
  }

  toList(): TreeFolder {
    return this.listContents(this.path, this.recursive);
  }

  private listContents = (path: string, recursive: boolean = true): TreeFolder => {
    try {
      const contents = fs.readdirSync(path);

      if (recursive) {
        contents.forEach((folder) => {
          const innerPath = `${path}\\${folder}`;
          const innerStat = this.listStats(innerPath);

          if (innerStat.isFile()) {
            const nestedFile = new TreeFile(innerPath);

            if (this.pathContents && this.pathContents.files) {
              // this.pathContents.files.push(nestedFile);
            }
          }

          else if (innerStat.isDirectory()) {
            const nestedFolder = new TreeFolder(innerPath);

            if (this.pathContents && this.pathContents.folders) {
              this.pathContents.folders.push(nestedFolder);
            }
            this.listContents(innerPath);
          }
        });
      }

      return this.pathContents ? this.pathContents : new TreeFolder('teste');
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
