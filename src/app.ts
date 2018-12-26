import commander from 'commander';
import process from 'process';
import readline from 'readline';
import { Tree, TreeFile, SubtitleClient } from './classes';
import { openSubtitles } from './classes/clients';

class Application {
  constructor(rdConfig: any, processConfig: any) {
    rdConfig.emitKeypressEvents(process.stdin);
    processConfig.stdin.setRawMode && processConfig.stdin.setRawMode(true);
    processConfig.stdin.on('keypress', (str: any, key: any) => {
      if (key.ctrl && key.name === 'c') {
        processConfig.exit();
      }
    });
  }

  public init = ({
    path,
    extensions,
  }: {
    path: string;
    extensions: string;
  }): void => {
    const fileTree: Tree = new Tree(path, true, extensions);
    const movieFiles: TreeFile[] = fileTree.filesOnly();

    const osClient = new openSubtitles();
    const subManager = new SubtitleClient(osClient);
    subManager.get(movieFiles);
  }
}

const app = new Application(readline, process);

commander.version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .option('-e, --extensions <required>', 'Tell me your movies extensions!')
  .action(app.init);

commander.parse(process.argv);
