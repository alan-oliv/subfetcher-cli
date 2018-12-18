 import { IFileSystem } from '../interfaces';
 import * as Path from 'path';

export default class Subtitle {
  private filename: string;
  private url: string;
  private score: number;

  constructor(fileLink: string, url: string, score: number) {
    this.filename = fileLink;
    this.url = url;
    this.score = score;
  }
}
