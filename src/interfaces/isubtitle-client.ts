import { Subtitle, TreeFile } from '../classes';

export default interface ISubtitleClient {
  intent: any;
  search(file: TreeFile, languages: string[]): Promise<Subtitle[]>;
}
