import OS from 'opensubtitles-api';
import { Subtitle, TreeFile } from '../../classes';
import { ISubtitleClient } from '../../interfaces';

export default class OpenSubtitles implements ISubtitleClient {
  intent: any;

  constructor(userAgent: string = 'TemporaryUserAgent') {
    this.intent = new OS({ useragent: userAgent });
  }

  public search = async (file: TreeFile): Promise<Array<Subtitle>> =>
    this.intent
      .search({
        sublanguageid: 'pob',
        path: `${file.path}${file.name}.${file.extension}`,
        extensions: ['srt'],
        limit: 'all'
      })
      .then(async (sub: any) => {
        console.log(sub[0]);

        //method already returning array - so transform this return into a list of subs to respective languages
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
