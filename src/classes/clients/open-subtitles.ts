import OS from 'opensubtitles-api';
import { Subtitle, TreeFile } from '../../classes';

export default class OpenSubtitles {
  private intent: any;

  constructor(userAgent: string) {
    this.intent = new OS({ useragent: userAgent });
  }

  public search = async (file: TreeFile) =>
    this.intent
      .search({
        sublanguageid: 'pob',
        path: `${file.path}${file.name}.${file.extension}`,
        extensions: ['srt']
      })
      .then(async (sub: any) => {
        if (sub.pb) {
          return new Subtitle(
            sub.pb.filename,
            sub.pb.format,
            sub.pb.url,
            sub.pb.score
          );
        }
      });
}
