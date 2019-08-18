import * as fs from "fs";
import * as path from "path";
import { envValue } from './env-value';
import { Iterator } from './iterator';

const TARGET_OBJ_NAME = 'envInjectorTargetObj';
const NEXT_OBJ_NAME = 'injectNextObject';

export function injectEnvs (fileNames : string, debug = false) {
  fileNames.replace(/[\s\n]+/, ';').split(';').forEach(fileName => writeFile(fileName, debug));
}

function writeFile(fileName : string, debug : boolean) {
  const builtFile = path.join(process.cwd(), fileName);

  const fileContent = fs.readFileSync(builtFile, 'utf-8');

  let index = 0;
  let string = fileContent;

  while ((index = string.indexOf(TARGET_OBJ_NAME, index)) !== -1) {
    index += TARGET_OBJ_NAME.length;
    const iterator = new Iterator(string, index, debug);
    string = iterator.replace();
  }

  index = 0;
  while ((index = string.indexOf(NEXT_OBJ_NAME, index)) !== -1) {
    index += NEXT_OBJ_NAME.length;
    const iterator = new Iterator(string, index, debug);
    string = iterator.replace();
  }

  const re = /\[__(\S+?)__]/g;
  let match;

  while ((match = re.exec(string))) {
    const envVar = match[1];
    const pattern = new RegExp('\\[__' + envVar + '__]', 'g');
    const value = envValue(envVar);

    if (debug) {
      console.log('Attempting to replace', envVar, pattern, value);
    }
    if (value) {
      if (debug) {
        console.log('Performing Replacement');
      }
      string = string.replace(pattern, `${value}`);
    }
  }

  fs.writeFileSync(builtFile, string);
}
