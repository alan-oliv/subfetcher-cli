import { IFileSystem } from '../interfaces';
import * as Path from 'path';

export default class TreeFile implements IFileSystem {
  name: string;
  path: string;
  extension: string;
  size: number;

  constructor(path: string, size: number) {
    this.name = Path.basename(path, Path.extname(path));
    this.extension = Path.extname(path).replace(/\./g, '');
    this.path = path.replace(Path.basename(path), '');
    this.size = size;
  }
}
