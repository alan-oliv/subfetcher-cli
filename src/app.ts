import Fetch from 'commander';
import Process from 'process';
import { Tree } from './classes';

const listFunction = ({ path = 'D:\\Workspace\\subfetcher\\Filmes' }: { path:string }): void => {
  const fileTree: Tree = new Tree(path, true);
  const folderContents: any = fileTree.filesOnly();
  // console.log(folderContents);
};

Fetch
  .version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .action(listFunction);

Fetch.parse(Process.argv);
