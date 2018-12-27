import fs from 'fs';
import * as Path from 'path';
import { TreeFile, TreeFolder } from '.';

export default class Tree {
  private readonly megabytes: number = 1000000.0;
  private readonly path: string;
  private readonly recursive: boolean = true;
  private readonly extensions?: string[];
  private treeContents: TreeFolder;
  private contents: any;

  constructor(path: string, recursive: boolean, extensions?: string[]) {
    this.path = path;
    this.recursive = recursive;
    this.extensions = extensions;
    this.treeContents = new TreeFolder(path);
  }

  public all(): TreeFolder {
    return this.listContents(this.path);
  }

  public foldersOnly(): string[] {
    this.contents = [];
    return this.listContents(this.path, true, false);
  }

  public filesOnly(): TreeFile[] {
    this.contents = [];
    return this.listContents(this.path, false, true);
  }

  private listContents = (
    path: string,
    foldersOnly: boolean = false,
    filesOnly: boolean = false,
    nestedFolder?: TreeFolder,
  ): any => {
    try {
      const contents: string[] = fs.readdirSync(path);
      contents.forEach((folder: any) => {
        const innerPath: string = Path.join(path, folder);
        const innerStat: any = this.listStats(innerPath);
        this.handleInnerStat(
          innerPath,
          innerStat,
          foldersOnly,
          filesOnly,
          nestedFolder,
        );
      });

      return this.contents.length ? this.contents : this.treeContents;
    } catch (e) {
      return e;
    }
  }

  private listStats = (path: string): any => {
    try {
      return fs.statSync(path);
    } catch (e) {
      return e;
    }
  }

  private handleInnerStat = (
    innerPath: string,
    innerStat: any,
    foldersOnly: boolean = false,
    filesOnly: boolean = false,
    nestedFolder?: TreeFolder,
  ): void => {
    try {
      const currentFolder = nestedFolder ? nestedFolder : this.treeContents;

      if (innerStat.isFile()) {
        const mbFileSize: number = innerStat.size / this.megabytes;
        const innerFile: TreeFile = new TreeFile(innerPath, mbFileSize);
        const currentExtension = innerFile.extension.replace(/[ .]/g, '');
        const matchExtensions =
          this.extensions && this.extensions.includes(currentExtension, 0);

        if (filesOnly) {
          matchExtensions && this.contents.push(innerFile);
        } else {
          matchExtensions && currentFolder.addFile(innerFile);
        }
      } else if (innerStat.isDirectory()) {
        const innerFolder: TreeFolder = new TreeFolder(innerPath);
        if (foldersOnly) {
          this.contents.push(innerPath);
        } else if (!foldersOnly && !filesOnly) {
          currentFolder.addFolder(innerFolder);
        }

        if (this.recursive) {
          this.listContents(innerPath, foldersOnly, filesOnly, innerFolder);
        }
      }
    } catch (e) {
      return e;
    }
  }
}
