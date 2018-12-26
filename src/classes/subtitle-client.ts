import { Subtitle, TreeFile } from '../classes';
import http, { ClientRequest } from 'http';
import fs from 'fs';
import chalk from 'chalk';
import process from 'process';

export default class SubtitleClient {
  private downloadList?: any;
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  public get = (movieTree: TreeFile[], languages: string[]): void => {
    this.downloadList = this.search(movieTree, languages);
  }

  public async search(folderContents: TreeFile[], languages: string[]): Promise<void> {
    for (const file of folderContents) {
      console.log(chalk` \nSearching subtitles for {blue ${file.name}}`);
      const movieSubs: Subtitle[] = await this.client.search(file, languages);

      if (movieSubs.length) {
        for (const sub of movieSubs) {
          await this.download(sub, `${file.path}${sub.filename}`);
          console.log(
            chalk`{bgGreenBright.black  Successfully } downloaded: ${
              sub.filename
            }`,
          );
        }
      } else {
        console.log(
          chalk`{bgRedBright.black  Failure } subtitle not found for: ${
            file.name
          }`,
        );
      }
    }
  }

  public download = async (
    file: Subtitle,
    path: string,
  ): Promise<ClientRequest> => {
    const newFile = fs.createWriteStream(path);
    return http.get(file.url, (response: any) => {
      response.pipe(newFile);
      newFile.on('finish', () => {
        newFile.close();
      });
    });
  }
}
