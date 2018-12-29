import opensubtitlesApi from 'opensubtitles-api';
import { Subtitle, TreeFile, Language } from '../..';
import { ISubtitleClient } from '../../../interfaces';

export default class OpenSubtitles implements ISubtitleClient {
  intent: any;

  constructor(userAgent: string = 'TemporaryUserAgent') {
    this.intent = new opensubtitlesApi({ useragent: userAgent });
  }

  public languages = async (): Promise<Language[]> => {
    const allLanguages: Language[] = [];
    const { data: availableLanguages } =  await this.intent.api.GetSubLanguages();
    availableLanguages.forEach((language: any) => {
      allLanguages.push(new Language(language.LanguageName, language.SubLanguageID));
    });
    return allLanguages;
  }

  public search = async (
    file: TreeFile,
    languages: string[],
  ): Promise<Subtitle[]> => {
    const movieSubtitles: Subtitle[] = [];
    const availableSubtitles = await this.intent.search({
      sublanguageid: languages.join(','),
      path: `${file.path}${file.name}.${file.extension}`,
      extensions: ['srt'],
      limit: 'all',
    });

    const availableLanguages = Object.keys(availableSubtitles);
    availableLanguages.forEach((language: any) => {
      const subtitle = availableSubtitles[language];
      if (subtitle.length) {
        subtitle.forEach((languageSubtitle: any) => {
          movieSubtitles.push(
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
        movieSubtitles.push(
          new Subtitle(
            subtitle.filename,
            subtitle.langcode,
            subtitle.format,
            subtitle.url,
            subtitle.score,
          ),
        );
      }
    });
    return movieSubtitles;
  }
}
