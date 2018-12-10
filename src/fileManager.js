import fs from 'fs';

const File = {
  listContents: async (path, recursive = true) => new Promise((resolve, reject) => {
    fs.readdir(path, (err, content) => {
      if (err) {
        reject(err);
      } else {
        const allContent = [];
        if (recursive) {
          // TO DO
          // content.forEach((item) => {
          //   const fromPath = `${path}\\${item}`;
          //   File.listStats(fromPath).then((folderItem) => {
          //     if (folderItem.isFile()) {
          //       console.log(`file - ${item}`);
          //     } if (folderItem.isDirectory()) {
          //       console.log(`dir - ${item}`);
          //     }
          //   });
          // });
        } else {
          resolve(content);
        }
      }
    });
  }),
  listStats: async path => new Promise((resolve, reject) => {
    fs.stat(path, (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  }),
};

export default File;
