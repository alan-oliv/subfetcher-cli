/* eslint-disable no-underscore-dangle */
import fs from 'fs';

class Tree {
  constructor(path, recursive = true) {
    this._path = path;
    this._recursive = recursive;
    this._pathContents = [];
  }

  toList = () => {
    this._pathContents = [];
    return this._listContents(this._path, this._recursive);
  }

  _listContents = (path, recursive = true) => {
    try {
      const contents = fs.readdirSync(path);
      if (recursive) {
        contents.forEach(async (folder) => {
          const folderPath = `${path}\\${folder}`;
          this._pathContents.push(folder);

          const folderStat = Tree._listStats(folderPath);
          if (folderStat.isDirectory()) {
            this._listContents(folderPath);
          }
        });
      }

      return this._pathContents;
    } catch (e) {
      return e;
    }
  }

  static _listStats(path) {
    try {
      return fs.statSync(path);
    } catch (e) {
      return e;
    }
  }
}

export default Tree;
