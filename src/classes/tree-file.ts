 import IFileSystem from '../interfaces/ifile-system';

 // TO DO: ADD SIZE AND EXTENSIONS PROPERTIES
export default class TreeFile implements IFileSystem {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
