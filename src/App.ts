import commander from 'commander';
import process from 'process';
import readline from 'readline';
import inquirer from 'inquirer';
import fs from 'fs';
import { Tree, TreeFile, SubtitleClient, Language } from './classes';
import { ISubtitleClient } from './interfaces';
import OpenSubtitles from './classes/clients/OpenSubtitles/OpenSubtitles';

class Application {
  private client: ISubtitleClient;
  private readonly questions: object[] = [
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
      choices: fs.readdirSync(`${__dirname}/classes/clients`),
    },
    {
      type: 'checkbox',
      name: 'languages',
      message: 'What languages do you want to download your subtitles?',
      choices: async ({ client }: { client: string }): Promise<Language[]> => {
        const {
          default: Client,
        } = await import(`./classes/clients/${client}/${client}`);
        this.client = new Client();
        const allLanguages = await this.client.languages();
        return allLanguages;
      },
    },
  ];

  public init = ({
    path,
    extensions,
    languages,
  }: {
    path: string;
    extensions: string;
    languages: string;
  }): void => {
    new Promise((resolve: any) => {
      if (!path || !extensions || !languages) {
        inquirer
          .prompt(this.questions)
          .then(
            async ({
              path,
              extensions,
              languages,
            }: {
              path: string;
              extensions: string[];
              languages: Language[];
            }) => {
              resolve({ path, extensions, languages });
            },
          );
      } else {
        const extensionsToArray = extensions
          ? extensions.replace(/[ .]/g, '').split(',')
          : [];

        const languagesToArray = languages
          ? languages.replace(/[ .]/g, '').split(',')
          : [];

        resolve({
          path,
          extensions: extensionsToArray,
          languages: languagesToArray,
        });
      }
    }).then((resolve: any) => {
      const {
        path,
        extensions,
        languages,
      }: {
        path: string;
        extensions: string[];
        languages: string[];
      } = resolve;

      const fileTree: Tree = new Tree(path, true, extensions);
      const movieFiles: TreeFile[] = fileTree.filesOnly();
      const subManager = new SubtitleClient(this.client);
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
    '-c, --client <required> (string)',
    'Name of the desired search client',
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
