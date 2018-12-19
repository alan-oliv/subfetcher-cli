import { ISubtitleClient } from '../interfaces';
import { Tree, Subtitle, TreeFile } from '../classes';
import OS from 'opensubtitles-api';
import fs from 'fs';
import http, { ClientRequest } from 'http';

export default class SubtitleClient implements ISubtitleClient {
  private downloadList:  IterableIterator<void>;
  private OpenSubtitles: any;

  constructor(tree: Array<TreeFile>) {
    this.downloadList = this.search(tree);

    this.OpenSubtitles = new OS({
      useragent: 'TemporaryUserAgent'
    });

    this.downloadList.next();
  }

  public *search(folderContents: Array<TreeFile>): IterableIterator<void> {
    let subtitle: Subtitle;

    for (let file of folderContents) {
      console.log(`Downloading subs for ${file.name}${file.extension}`);

      this.OpenSubtitles.search({
        sublanguageid: 'pob',
        path: file.path,
        extensions: ['srt']
      })
        .then(async (sub: any) => {
          let result: string = '';
          let color: string = '';

          if (sub.pb) {
            subtitle = new Subtitle(
              sub.pb.filename,
              sub.pb.format,
              sub.pb.url,
              sub.pb.score
            );
            const videoExtension = new RegExp(file.extension, 'g');
            const destinationPath = file.path.replace(
              videoExtension,
              subtitle.extension
            );

            try {
              await this.download(subtitle, destinationPath);
              result = `Success`;
              color = `\x1b[36m%s\x1b[0m`;
            } catch (e) {
              result = `Failure ${e}`;
              color = `\x1b[31m%s\x1b[0m`;
            }
          } else {
            result = 'Subtitle not found';
            color = `\x1b[31m%s\x1b[0m`;
          }
          result && console.log(color, result);
        })
        .then(() => {
          this.downloadList.next();
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
