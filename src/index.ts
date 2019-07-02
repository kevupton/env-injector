
export interface TargetObjectType {
  [key : string] : any;
}

export function envInjectorTargetObj<T extends TargetObjectType> (object : T) : T {
  return object;
}

/* Placeholder Object */
export function injectNextObject () {
}
