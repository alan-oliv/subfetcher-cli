import Fetch from 'commander';
import Process from 'process';
import Tree from './classes/tree';

const listFunction = ({ path }: { path:string }) => {
  const fileTree = new Tree(path, true);
  const folderContents = fileTree.toList();
  console.log(folderContents);
};

Fetch
  .version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .action(listFunction);

Fetch.parse(Process.argv);
