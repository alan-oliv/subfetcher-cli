import Program from 'commander';
import File from './fileManager';

const listFunction = ({ moviesFolder }) => {
  File.listContents(moviesFolder, true).then((content) => {
    //console.log(content);
  });
};

Program
  .version('0.0.1')
  .option('-f, --movies-folder <required>', 'Tell me the path to your movies!')
  .action(listFunction);

Program.parse(process.argv);