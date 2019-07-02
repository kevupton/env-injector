import * as fs from "fs";
import * as path from "path";
import { Iterator } from './iterator';

const TARGET_OBJ_NAME = 'envInjectorTargetObj';
const NEXT_OBJ_NAME = 'injectNextObject';

export function injectEnvs (fileName : string, debug = false) {
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

  fs.writeFileSync(builtFile, string);
}
