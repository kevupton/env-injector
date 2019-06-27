import * as fs from 'fs';
import * as path from 'path';
import { Iterator } from './iterator';

const TARGET_OBJ_NAME = 'envInjectorTargetObj';

export interface TargetObjectType {
  [key : string] : any;
}

export function envInjectorTargetObj<T extends TargetObjectType> (object : T) : T {
  return object;
}

export function injectEnvs (fileName : string, debug = false) {
  const builtFile = path.join(process.cwd(), fileName);

  const fileContent = fs.readFileSync(builtFile, 'utf-8');

  let index = 0;
  let string = fileContent;
  console.log(TARGET_OBJ_NAME);
  while ((index = string.indexOf(TARGET_OBJ_NAME, index)) !== -1) {
    const iterator = new Iterator(string, index + TARGET_OBJ_NAME.length, debug);
    string = iterator.replace();
    index++; // so that we dont iterate over the same object
  }

  fs.writeFileSync(builtFile, string);
}
