import { Subtitle, TreeFile } from '../classes';
import http, { ClientRequest } from 'http';
import fs from 'fs';
import chalk from 'chalk';
import process from 'process';

export default class SubtitleClient {
  private downloadList?: IterableIterator<void>;
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  public get = (movieTree: TreeFile[]): void => {
    this.downloadList = this.search(movieTree);
    this.downloadList.next();
  }

  public *search(folderContents: TreeFile[]): IterableIterator<void> {
    for (const file of folderContents) {
      console.log(chalk` \nSearching subtitles for {blue ${file.name}}`);

      this.client
        .search(file)
        .then(async (movieSubs: Subtitle[]) => {
          if (movieSubs) {
            movieSubs.forEach(async (sub: Subtitle) => {
              try {
                await this.download(sub, `${file.path}${sub.filename}`);
                console.log(
                  chalk`{bgGreenBright.black  Successfully } downloaded: ${
                    sub.filename
                  }`,
                );
              } catch (e) {
                console.log(
                  chalk`{bgRedBright.black  Failure } downloading: ${
                    sub.filename
                  }`,
                );
              }
            });
          } else {
            console.log(
              chalk`{bgRedBright.black  Failure } subtitle not found for: ${
                file.name
              }`,
            );
          }
        })
        .then(() => {
          const next = this.downloadList && this.downloadList.next();
          if (next && next.done) {
            process.exit();
          }
        })
        .catch((error: any) => {
          console.log(error);
        });

      yield;
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
