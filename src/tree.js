import fs from 'fs';

class Tree {
  #path;
  #recursive;
  #pathContents;

  constructor(path, recursive = true) {
    this.#path = path;
    this.#recursive = recursive;
    this.#pathContents = [];
  }

  toList = () => {
    this.#pathContents = [];
    return this._listContents(this.#path, this._recursive);
  }

  _listContents = (path, recursive = true) => {
    try {
      const contents = fs.readdirSync(path);
      if (recursive) {
        contents.forEach(async (folder) => {
          const folderPath = `${path}\\${folder}`;
          this.#pathContents.push(folder);

          const folderStat = Tree._listStats(folderPath);
          if (folderStat.isDirectory()) {
            this._listContents(folderPath);
          }
        });
      }

      return this.#pathContents;
    } catch (e) {
      return e;
    }
  }

  static _listStats = (path) => {
    try {
      return fs.statSync(path);
    } catch (e) {
      return e;
    }
  }
}

export default Tree;
