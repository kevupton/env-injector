import { isFinite, isUndefined, upperCase } from 'lodash';

export function envName (name : string) {
  return upperCase(name).replace(/\s+/g, '_');
}

export function envValue (key : string, defaultValue? : any) {
  const value = process.env[envName(key)];

  if (isUndefined(value)) {
    return defaultValue;
  }

  const lval = value.toLowerCase();

  if (lval === 'true') {
    return true;
  }
  else if (lval === 'false') {
    return false;
  }
  else if (lval === 'null') {
    return null;
  }
  else if (isFinite(lval)) {
    return Number(lval);
  }
  return value;
}
