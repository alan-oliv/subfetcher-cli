import { IFileSystem } from '../interfaces';
import * as Path from 'path';

export default class Language {
  public value: string;
  public name: string;

  constructor(
    name: string,
    value: string,
  ) {
    this.name = name;
    this.value = value;
  }
}
