import Fetch from 'commander';
import Process from 'process';
import FileSystemTree from './file-system-tree';

const listFunction = ({ path }: { path:string }) => {
  const fileTree = new FileSystemTree(path, true);
  const folderContents = fileTree.toList();
  console.log(folderContents);
};

Fetch
  .version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .action(listFunction);

Fetch.parse(Process.argv);
