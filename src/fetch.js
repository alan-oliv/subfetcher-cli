import Fetch from 'commander';
import File from './file-manager';

const listFunction = ({ moviesFolder }) => {
  const a = File.listContents(moviesFolder);
  console.log(a);
};

Fetch
  .version('0.0.1')
  .option('-f, --movies-folder <required>', 'Tell me the path to your movies!')
  .action(listFunction);

Fetch.parse(process.argv);
