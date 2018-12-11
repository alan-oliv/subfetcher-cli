import Fetch from 'commander';
import Tree from './tree';

const listFunction = ({ moviesFolder }) => {
  const moviesTree = new Tree(moviesFolder);
  const moviesTreeContents = moviesTree.toList();
  // const moviesTreeContents2 = moviesTree._listContents(moviesFolder, true)
  console.log(moviesTreeContents);
};

Fetch
  .version('0.0.1')
  .option('-f, --movies-folder <required>', 'Tell me the path to your movies!')
  .action(listFunction);

Fetch.parse(process.argv);
