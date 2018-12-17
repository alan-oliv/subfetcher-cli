import Fetch from 'commander';
import Process from 'process';
import { Tree } from './classes';

const listFunction = ({ path = 'D:\\Workspace\\subfetcher\\Filmes', extensions }: { path:string, extensions: string }): void => {
  const ext: Array<string> = extensions ? extensions.trim().split(',') : [];
  const fileTree: Tree = new Tree(path, true, extensions);
  const folderContents: any = fileTree.all();
  console.log(folderContents);
};

Fetch
  .version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .option('-e, --extensions <required>', 'Tell me your movies extensions!')
  .action(listFunction);

Fetch.parse(Process.argv);
