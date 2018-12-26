import commander from 'commander';
import process from 'process';
import readline from 'readline';
import inquirer from 'inquirer';
import { Tree, TreeFile, SubtitleClient } from './classes';
import { OpenSubtitles } from './classes/clients';

// to do: instanciante dinamically the client
class Application {
  private readonly questions: object[];

  constructor() {
    this.questions = [
      {
        type: 'input',
        name: 'path',
        message: 'What is the path to your movie folder?',
      },
      {
        type: 'checkbox',
        name: 'extensions',
        message: 'Which movie extensions contains in this folder?',
        choices: ['mp4', 'mkv', 'avi', 'rmvb', 'amv', 'm4v', 'rmvb'],
      },
      {
        type: 'list',
        name: 'client',
        message: 'What client do you want to use?',
        choices: ['Opensubtitles'],
      },
    ];
  }

  public init = ({
    path,
    extensions,
    client = 'OpenSubtitles',
    languages,
  }: {
    path: string;
    extensions: string;
    client: string;
    languages: string;
  }): void => {
    new Promise((resolve: any) => {
      if (!path || !extensions || !languages) {
        inquirer
          .prompt(this.questions)
          .then(
            ({
              path,
              extensions,
              client,
            }: {
              path: string;
              extensions: string[];
              client: string;
            }) => {
              resolve({ path, extensions, client });
            },
          );
      } else {
        const extensionsToArray = extensions
          ? extensions.replace(/[ .]/g, '').split(',')
          : [];

        const languagesToArray = languages
          ? languages.replace(/[ .]/g, '').split(',')
          : [];

        resolve({ path, client, extensions: extensionsToArray, languages: languagesToArray });
      }
    }).then((resolve: any) => {
      const {
        path,
        extensions,
        client,
        languages,
      }: {
        path: string;
        extensions: string[];
        client: string;
        languages: string[];
      } = resolve;

      const fileTree: Tree = new Tree(path, true, extensions);
      const movieFiles: TreeFile[] = fileTree.filesOnly();
      const osClient = new OpenSubtitles();
      const subManager = new SubtitleClient(osClient);
      subManager.get(movieFiles, languages);
    });
  }
}

const app = new Application();

commander
  .version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .option(
    '-e, --extensions <required> (string, comma separated)',
    'Extensions that your movies are',
  )
  .option(
    '-l, --languages <required> (string, comma separated)',
    'Desired subtitles languages',
  )
  .option(
    '-c, --client <optional> (string)',
    'Name of the desired search client (Opensubtitles is default)',
  )
  .action(app.init);

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode && process.stdin.setRawMode(true);
process.stdin.on('keypress', (str: any, key: any) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  }
});

commander.parse(process.argv);
