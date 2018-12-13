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
}
