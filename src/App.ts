import commander from 'commander';
import process from 'process';
import readline from 'readline';
import inquirer from 'inquirer';
import fs from 'fs';
import { Tree, TreeFile, SubtitleClient, Language, Convert } from './classes';
import { ISubtitleClient } from './interfaces';

class Application {
  private client: ISubtitleClient;
  private readonly questions: object[] = [
    {
      type: 'input',
      name: 'path',
      message: 'What is the path to your movie folder?',
      validate: (path: string) => {
        const isValidPath = fs.existsSync(path);
        return !isValidPath
          ? `This doesn't seem to be a valid path :(`
          : isValidPath;
      }
    },
    {
      type: 'checkbox',
      name: 'extensions',
      message: 'Which movie extensions contains in this folder?',
      choices: ['mp4', 'mkv', 'avi', 'rmvb', 'amv', 'm4v', 'rmvb']
    },
    {
      type: 'list',
      name: 'client',
      message: 'What client do you want to use?',
      choices: fs.readdirSync(`${__dirname}/classes/clients`)
    },
    {
      type: 'checkbox',
      name: 'languages',
      message: 'What languages do you want to download your subtitles?',
      choices: async ({ client }: { client: string }): Promise<Language[]> => {
        await this.importClientAsync(client);
        const allLanguages = await this.client.languages();
        return allLanguages;
      }
    }
  ];

  private importClientAsync = async (client: string): Promise<void> => {
    const {
      default: Client
    } = await import(`./classes/clients/${client}/${client}`);
    this.client = new Client();
  };

  public init = ({
    path,
    client,
    extensions,
    languages
  }: {
    path: string;
    client: string;
    extensions: string;
    languages: string;
  }): void => {
    new Promise(async (resolve: any) => {
      if (!path || !extensions || !languages) {
        inquirer
          .prompt(this.questions)
          .then(
            async ({
              path,
              extensions,
              languages
            }: {
              path: string;
              extensions: string[];
              languages: Language[];
            }) => {
              resolve({ path, extensions, languages });
            }
          );
      } else {
        await this.importClientAsync(client);

        resolve({
          path,
          extensions: Convert.toArray(extensions),
          languages: Convert.toArray(languages)
        });
      }
    }).then((resolve: any) => {
      const {
        path,
        extensions,
        languages
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
  };
}

const app = new Application();

commander
  .version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .option(
    '-e, --extensions <required> (string, comma separated)',
    'Extensions that your movies are'
  )
  .option(
    '-l, --languages <required> (string, comma separated)',
    'Desired subtitles languages'
  )
  .option(
    '-c, --client <required> (string)',
    'Name of the desired search client'
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
