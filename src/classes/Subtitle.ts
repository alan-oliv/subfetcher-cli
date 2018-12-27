import { IFileSystem } from '../interfaces';
import * as Path from 'path';

export default class Subtitle {
  public filename: string;
  public language: string;
  public extension: string;
  public url: string;
  private score: number;

  constructor(
    filename: string,
    language: string,
    extension: string,
    url: string,
    score: number,
  ) {
    this.filename = filename;
    this.language = language;
    this.extension = extension;
    this.url = url;
    this.score = score;
  }
}
