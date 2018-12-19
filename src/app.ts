import Fetch from 'commander';
import Process from 'process';
import OS from 'opensubtitles-api';
import { Tree, Subtitle, TreeFile } from './classes';
import Readline from 'readline';
import fs from 'fs';
import http from 'http';

const OpenSubtitles = new OS({
  useragent: 'TemporaryUserAgent'
});

Readline.emitKeypressEvents(Process.stdin);
Process.stdin.setRawMode && Process.stdin.setRawMode(true);
let downloadList: any;

const list = ({ path = 'D:\\_aloliv\\Movies2', extensions = 'mp4' }: { path: string, extensions: string }): void => {
  const fileTree: Tree = new Tree(path, true, extensions);
  const movieFiles: Array<TreeFile> = fileTree.filesOnly();
  downloadList = search(movieFiles);
  downloadList.next();

  Process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      Process.exit();
    }
  });
};

function* search(folderContents: Array<TreeFile>, currentMovie?: string) {
  if (folderContents) {
    let subtitle: Subtitle;

    for (let file of folderContents) {
      console.log(`Downloading subs for ${file.name}${file.extension}`)

      OpenSubtitles.search({
        sublanguageid: 'pob',
        path: file.path,
        extensions: ['srt']
      }).then(async (sub: any) => {
        let result: string = '';
        let color: string = '';

        if (sub.pb) {
          subtitle = new Subtitle(sub.pb.filename, sub.pb.format, sub.pb.url, sub.pb.score);
          const videoExtension = new RegExp(file.extension, 'g');
          const destinationPath = file.path.replace(videoExtension, subtitle.extension);

          try {
            await download(subtitle, destinationPath);
            result = `Success`;
            color = `\x1b[36m%s\x1b[0m`;

          }
          catch (e) {
            result = `Failure ${e}`;
            color = `\x1b[31m%s\x1b[0m`;
          }

        } else {
          result = 'Subtitle not found';
          color = `\x1b[31m%s\x1b[0m`;
        }
        result && console.log(color, result);
      }).then(() => {
        downloadList.next();
      }).catch((error: any) => {
        console.log(error);
      })

      yield;
    }
  }
}

const download = async (file: Subtitle, path: string) => {
  const newFile = fs.createWriteStream(path);
  return http.get(file.url, function (response: any) {
    response.pipe(newFile);
    newFile.on('finish', function () {
      newFile.close();
    });
  });
};

Fetch
  .version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .option('-e, --extensions <required>', 'Tell me your movies extensions!')
  .action(list);

Fetch.parse(Process.argv);
