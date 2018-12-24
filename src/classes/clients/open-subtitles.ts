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
        if (sub.pb) {
          const subsInLanguage: Array<Subtitle> = [];

          sub.pb.forEach((languageSubtitle: any) => {
            const languageItem = new Subtitle(
              languageSubtitle.filename,
              languageSubtitle.format,
              languageSubtitle.url,
              languageSubtitle.score
            );
            subsInLanguage.push(languageItem);
          });

          return subsInLanguage;
        }
      });
}
