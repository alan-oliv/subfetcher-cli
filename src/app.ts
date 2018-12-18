import Fetch from 'commander';
import Process from 'process';
import OS from 'opensubtitles-api';
import { Tree, TreeFolder, Subtitle, TreeFile } from './classes';
const readline = require('readline');

const OpenSubtitles = new OS({
  useragent: 'TemporaryUserAgent',
  ssl: true
});


readline.emitKeypressEvents(Process.stdin);
Process.stdin.setRawMode && Process.stdin.setRawMode(true);
let downloadList: any;

const list = ({ path = '/home/alanoliveira/Workspace/subfetcher-cli/Filmes', extensions }: { path: string, extensions: string }): void => {
  const fileTree: Tree = new Tree(path, true, extensions);
  const movieFiles: Array<TreeFile> = fileTree.filesOnly();
  downloadList = downloadSubtitle(movieFiles);
  downloadList.next();

  Process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      Process.exit();
    }
  });
};

function* downloadSubtitle(folderContents: Array<TreeFile>, currentMovie?: string) {
  if (folderContents) {
    for (let i of folderContents) {
      console.log(`Downloading subs for ${i.name}?`)
      const a = getSub(i).then((item: any) => {
        console.log('downloaded');
        downloadList.next();
      });
      yield;
    }
  }
}

// const searchSubtitles = (folderContents: TreeFolder): void => {
//   folderContents.folders && folderContents.folders.forEach(async (folder: TreeFolder) => {

//     folder.files && folder.files.forEach(async (file: TreeFile) => {

//       const a = await getSub(file).then((s: any) => {
//         console.log(folder.name, true);
//       })
//         .catch((e: any) => {
//           console.log(folder.name, false);
//         });


//     });
//   })
// };

// function sleep(ms: number) {
//   return new Promise(resolve => {
//     setTimeout(resolve, ms)
//   })
// }

const getSub = (file: TreeFile) => OpenSubtitles.search({
  sublanguageid: 'pob',
  path: file.path,
  extensions: ['srt']
});



// pb.forEach(({ filename, url, score }: { filename: string, url: string, score: number }) => {
//   const newSub: Subtitle = new Subtitle(filename, url, score);
//   movieSubtitles.push(newSub);
//   console.log(newSub);
// });

// const downloadSubtitles = (folderContents: TreeFolder) => {
//   folderContents.folders && folderContents.folders.forEach(async (movie: TreeFolder) => {
//     const movieSubtitles = searchSubtitles(movie);
//   });
// };



Fetch

  .version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .option('-e, --extensions <required>', 'Tell me your movies extensions!')
  .action(list);

Fetch.parse(Process.argv);
