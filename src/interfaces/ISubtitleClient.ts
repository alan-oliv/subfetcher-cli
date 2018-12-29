import { Subtitle, TreeFile } from '../classes';
import Language from '../classes/Language';

export default interface ISubtitleClient {
  intent: any;
  search(file: TreeFile, languages: string[]): Promise<Subtitle[]>;
  languages(): Promise<Language[]>;
}
