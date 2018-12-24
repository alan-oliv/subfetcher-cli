import { ISubtitleClient } from '../interfaces';
import { Subtitle, TreeFile } from '../classes';
import http, { ClientRequest } from 'http';
import fs from 'fs';
import chalk from 'chalk';

export default class SubtitleClient {
  private downloadList?: IterableIterator<void>;
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  public get = (movieTree: Array<TreeFile>): void => {
    this.downloadList = this.search(movieTree);
    this.downloadList.next();
  }

  public *search(folderContents: Array<TreeFile>): IterableIterator<void> {
    for (let file of folderContents) {
      console.log(chalk` \nSearching subtitles for {blue ${file.name}}`);

      this.client.search(file)
        .then(async (movieSubs: Array<Subtitle>) => {
          movieSubs.forEach(async (sub: Subtitle) => {
            try {
              await this.download(
                sub,
                `${file.path}${sub.filename}`
              );
              console.log(chalk`{bgGreenBright.black ${sub.filename} successfully downloaded}`);
            } catch (e) {
              console.log(chalk`{bgRedBright.black  Failure: ${!sub ? `Subtitle not found` : e} }`);
            }
          });
        })
        .then(() => {
          this.downloadList && this.downloadList.next();
        })
        .catch((error: any) => {
          console.log(error);
         });

      yield;
    }
  }

  public download = async (
    file: Subtitle,
    path: string
  ): Promise<ClientRequest> => {
    const newFile = fs.createWriteStream(path);
    return http.get(file.url, function(response: any) {
      response.pipe(newFile);
      newFile.on('finish', function() {
        newFile.close();
      });
    });
  };
}
