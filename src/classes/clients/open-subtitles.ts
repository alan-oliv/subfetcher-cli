import opensubtitlesApi from 'opensubtitles-api';
import { Subtitle, TreeFile } from '../../classes';
import { ISubtitleClient } from '../../interfaces';

export default class OpenSubtitles implements ISubtitleClient {
  intent: any;

  constructor(userAgent: string = 'TemporaryUserAgent') {
    this.intent = new opensubtitlesApi({ useragent: userAgent });
  }

  public search = (
    file: TreeFile,
    languages: string[],
  ): Subtitle[] =>
    this.intent
      .search({
        sublanguageid: languages.join(','),
        path: `${file.path}${file.name}.${file.extension}`,
        extensions: ['srt'],
        limit: 'all',
      })
      .then(async (sub: any) => {
        const subsInLanguage: Subtitle[] = [];
        const availableLanguages = Object.keys(sub);

        availableLanguages.forEach((language: any) => {
          const availableSubtitle = sub[language];
          if (availableSubtitle.length) {
            availableSubtitle.forEach((languageSubtitle: any) => {
              subsInLanguage.push(
                new Subtitle(
                  languageSubtitle.filename,
                  languageSubtitle.langcode,
                  languageSubtitle.format,
                  languageSubtitle.url,
                  languageSubtitle.score,
                ),
              );
            });
          } else {
            subsInLanguage.push(
              new Subtitle(
                availableSubtitle.filename,
                availableSubtitle.langcode,
                availableSubtitle.format,
                availableSubtitle.url,
                availableSubtitle.score,
              ),
            );
          }
        });
        return subsInLanguage;
      })
}
