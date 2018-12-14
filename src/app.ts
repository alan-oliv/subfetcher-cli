import Fetch from 'commander';
import Process from 'process';
import { Tree } from './classes';

const listFunction = ({ path = 'D:\\Workspace\\subfetcher\\Filmes', extensions }: { path:string, extensions: string }): void => {
  const fileTree: Tree = new Tree(path, true);
  const ext: Array<string> = extensions ? extensions.split(',') : [];
  const folderContents: any = fileTree.filesOnly(ext);
};

Fetch
  .version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .option('-w, --extensions <required>', 'Tell me your movies extensions!')
  .action(listFunction);

Fetch.parse(Process.argv);
