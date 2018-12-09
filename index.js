import { program } from 'commander';
program.version('0.0.1').command('list [directory]').description('List files and folders').option('-a, --all', 'List all files and folders').option('-l, --long', '').action();
program.parse(process.argv);
