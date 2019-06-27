import * as fs from 'fs';
import * as path from 'path';
import { Iterator } from './iterator';

export const DEFAULT_REPLACEMENT = '7gHsUYsbgVdXsu8GyBYK';

const TARGET_OBJ_NAME = envInjectorTargetObj.name;

export interface TargetObjectType {
  [key : string] : string | number | boolean;
}

export function envInjectorTargetObj (object : TargetObjectType) {

}

export function injectEnvs (fileName : string, replacement = DEFAULT_REPLACEMENT) {
  const builtFile = path.join(process.cwd(), fileName);

  const fileContent = fs.readFileSync(builtFile, 'utf-8');

  let index = 0;
  let string = fileContent;
  while ((index = string.indexOf(TARGET_OBJ_NAME, index)) !== -1) {
    const iterator = new Iterator(string, index + TARGET_OBJ_NAME.length);
    string = iterator.replace();
    index++; // so that we dont iterate over the same object
  }

  fs.writeFileSync(builtFile, string);
}
