import Fetch from 'commander';
import Process from 'process';
// import request from 'request';
import { Tree } from './classes';

const listFunction = ({ path = 'D:\\Workspace\\subfetcher\\Filmes', extensions }: { path: string, extensions: string }): void => {
  const fileTree: Tree = new Tree(path, true, extensions);
  const folderContents: any = fileTree.all();


  // const wholepath = `${path}\\${folderContents.folders[0].name}`
  // const wholefile = `${folderContents.folders[0].files[0].name}`

  // // Set the headers
  // var headers = {
  //   'User-Agent': 'TemporaryUserAgent',
  // }

  // var lower = "2036 nexus dawn";
  // // Configure the request
  // var options = {
  //   url: 'https://rest.opensubtitles.org/search/query-'+lower.toLowerCase()+'/sublanguageid-all',
  //   method: 'GET',
  //   headers: headers
  // }
  // console.log(options.url);
  // // Start the request
  // request(options, function (error: any, response: any, body: any) {
  //   if (!error && response.statusCode == 200) {
  //     // Print out the response body
  //     console.log(JSON.parse(body))
  //   } else {
  //     console.log(error);

  //   }
  // });


};

Fetch
  .version('0.0.1')
  .option('-f, --path <required>', 'Tell me the path to your movies!')
  .option('-e, --extensions <required>', 'Tell me your movies extensions!')
  .action(listFunction);

Fetch.parse(Process.argv);
