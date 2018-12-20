import { ISubtitleClient } from '../interfaces';
import { Subtitle, TreeFile, OpenSubtitles } from '../classes';
import http, { ClientRequest } from 'http';
import fs from 'fs';
import chalk from 'chalk';

export default class SubtitleClient implements ISubtitleClient {
  private downloadList: IterableIterator<void>;
  private OSClient: OpenSubtitles;

  constructor(tree: Array<TreeFile>) {
    this.downloadList = this.search(tree);
    this.OSClient = new OpenSubtitles('TemporaryUserAgent');
    this.downloadList.next();
  }

  public *search(folderContents: Array<TreeFile>): IterableIterator<void> {
    for (let file of folderContents) {
      console.log(chalk` \nSearching subtitles for {blue ${file.name}}`);

      this.OSClient.search(file)
        .then(async (sub: Subtitle) => {
          try {
            await this.download(
              sub,
              `${file.path}${file.name}.${sub.extension}`
            );
            console.log(chalk`{bgGreenBright.black  Success }`);
          } catch (e) {
            console.log(chalk`{bgRedBright.black  Failure: ${!sub ? `Subtitle not found` : e} }`);
          }
        })
        .then(() => {
          this.downloadList.next();
        })
        .catch((error: any) => { });

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
