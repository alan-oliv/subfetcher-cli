import fs from 'fs';
import * as Path from 'path';
import TreeFolder from './tree-folder';
import TreeFile from './tree-file';

export default class Tree {
  private readonly path: string;
  private readonly recursive: boolean = true;
  private pathContents: TreeFolder;

  constructor(path: string, recursive: boolean) {
    this.path = path;
    this.recursive = recursive;
    this.pathContents = new TreeFolder(path);
  }

  public toList(): TreeFolder {
    return this.listContents(this.path);
  }

  private listContents = (path: string, nestedFolder?: TreeFolder): TreeFolder => {
    try {
      const contents = fs.readdirSync(path);

      if (this.recursive) {
        contents.forEach((folder) => {
          const innerPath = Path.join(path, folder);
          const innerStat = this.listStats(innerPath);
          this.handleInnerStat(innerPath, innerStat, nestedFolder)
        });
      }
      return this.pathContents;
    } catch (e) {
      return e;
    }
  }

  private listStats = (path: string): object => {
    try {
      return fs.statSync(path);
    } catch (e) {
      return e;
    }
  }

  private handleInnerStat = (innerPath: string, innerStat: any, nestedFolder?: TreeFolder): void => {
    try {
      if (innerStat.isFile()) {
        const innerFile = new TreeFile(innerPath);
        const currentFolder = nestedFolder ? nestedFolder : this.pathContents;
        currentFolder.addFile(innerFile);
      } else if (innerStat.isDirectory()) {
        const innerFolder = new TreeFolder(innerPath);
        this.pathContents.addFolder(innerFolder);
        this.listContents(innerPath, innerFolder);
      }
    } catch (e) {
      return e;
    }
  }
}
