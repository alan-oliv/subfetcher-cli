 import { IFileSystem } from '../interfaces';
 import * as Path from 'path';

export default class TreeFile implements IFileSystem {
  path: string;
  extension: string;
  name: string;
  size: number;

  constructor(path: string, size: number) {
    this.path = path;
    this.extension = Path.extname(path).replace(/\./g, '');
    this.name = Path.basename(path).replace(this.extension, '');
    this.size = size;
  }
}
