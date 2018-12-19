import { Subtitle, TreeFile } from '../classes';
import { ClientRequest } from 'http';

export default interface ISubtitleClient {
  search(folderContents: Array<TreeFile>): IterableIterator<void>;

  download(file: Subtitle, path: string): Promise<ClientRequest>;
}
