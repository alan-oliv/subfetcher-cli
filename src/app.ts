import Fetch from 'commander';
import Process from 'process';
import Readline from 'readline';
import { Tree, TreeFile, SubtitleClient } from './classes';
import { OpenSubtitles } from './classes/clients';

class Application {
  constructor(rdConfig: any, processConfig: any) {
    rdConfig.emitKeypressEvents(Process.stdin);
    processConfig.stdin.setRawMode && processConfig.stdin.setRawMode(true);
    processConfig.stdin.on('keypress', (str: any, key: any) => {
      if (key.ctrl && key.name === 'c') {
        processConfig.exit();
      }
    });
  }

  public init = ({
    path,
    extensions
  }: {
    path: string;
    extensions: string;
  }): void => {
    const fileTree: Tree = new Tree(path, true, extensions);
    const movieFiles: Array<TreeFile> = fileTree.filesOnly();

    const OSClient = new OpenSubtitles();
    const subManager = new SubtitleClient(OSClient);
    subManager.get(movieFiles);
  };
}

const App = new Application(Readline, Process);

Fetch.version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .option('-e, --extensions <required>', 'Tell me your movies extensions!')
  .action(App.init);

Fetch.parse(Process.argv);
