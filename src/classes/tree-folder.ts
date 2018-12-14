 import IFileSystem from '../interfaces/ifile-system';
 import { TreeFile } from './';
 import * as Path from 'path';

export default class TreeFolder implements IFileSystem {
  path: string;
  name: string;
  files?: Array<TreeFile> = [];
  folders?: Array<TreeFolder> = [];

  constructor(path: string) {
    this.path = path;
    this.name = Path.basename(path);
  }

  public addFile(file: TreeFile): void {
    if (this.files) {
      this.files.push(file);
    }
  }

  public addFolder(folder: TreeFolder): void {
    if (this.folders) {
      this.folders.push(folder);
    }
  }
}
