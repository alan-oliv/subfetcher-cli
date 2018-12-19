import Fetch from 'commander';
import Process from 'process';
import Readline from 'readline';
import { Tree, TreeFile, SubtitleClient } from './classes';
class App {
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
    path = 'D:\\_aloliv\\Movies2',
    extensions = 'mp4'
  }: {
    path: string;
    extensions: string;
  }): void => {
    const fileTree: Tree = new Tree(path, true, extensions);
    const movieFiles: Array<TreeFile> = fileTree.filesOnly();
    new SubtitleClient(movieFiles);
  };
}

const Application = new App(Readline, Process);

Fetch.version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .option('-e, --extensions <required>', 'Tell me your movies extensions!')
  .action(Application.init);

Fetch.parse(Process.argv);
