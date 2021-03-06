import fs from 'fs';

import SimpleApmnModdle from '../';

export function ensureDirExists(dir) {

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

export function createModdle(additionalPackages, options) {
  return new SimpleApmnModdle(additionalPackages, options);
}