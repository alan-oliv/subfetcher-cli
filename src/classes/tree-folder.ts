 import IFileSystem from '../interfaces/ifile-system';
 import TreeFile from './tree-file';

 // TO DO: ADD SIZE AND EXTENSIONS PROPERTIES
export default class TreeFolder implements IFileSystem {
  name: string;
  files?: Array<TreeFile> = [];
  folders?: Array<TreeFolder> = [];

  constructor(name: string) {
    this.name = name;
  }

  public addFile(file: TreeFile): void {
    if(this.files) {
      this.files.push(file);
    }
  }

  public addFolder(folder: TreeFolder): void {
    if(this.folders) {
      this.folders.push(folder);
    }
  }
}
