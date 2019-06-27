import { isUndefined } from 'lodash';
import { envValue } from './env-value';

enum RecordingType {
  Key,
  Value,
}

export class Iterator {
  private '{}'            = 0;
  private '[]'            = 0;
  private '()'            = 0;
  private '""'            = false;
  private '\'\''          = false;
  private index           = 0;
  private valueStartIndex = 0;

  private ENV_VALUE? : any;
  private ENV_DEPTH = 0;

  private key   = '';
  private value = '';

  recording = RecordingType.Key;

  constructor (
    private string : string,
    beginning : number,
    private debug = false,
  ) {
    this.index = beginning;

    if (this.debug) {
      console.log('INIT', this.string, this.index);
    }
  }

  get isComplete () {
    return !this['()'] && !this['[]'] && !this['{}'] && !this['""'] && !this['\'\''];
  }

  get insideString () {
    return this['""'] || this['\'\''];
  }

  get insideObject () {
    return this['{}'] > 0;
  }

  get hasEnv () {
    return !isUndefined(this.ENV_VALUE);
  }

  get equalEnvDepth () {
    return this.ENV_DEPTH === this['{}'];
  }

  replace () {
    do {
      this.next();
    }
    while (!this.isComplete && this.index < this.string.length);

    if (!this.isComplete) {
      throw new Error('Unable to complete iteration');
    }

    return this.string;
  }

  private next () {
    const char = this.string[this.index];

    if (this.insideObject) {
      if (this.recording === RecordingType.Key) {
        this.key += char;
      }
      else {
        this.value += char;
      }
    }

    /*
     If it is currently a string, then skip, otherwise if it is closing a string then continue.
     */
    if (!(this.insideString && !'"\''.includes(char))) {
      this.handleCharCases(char);
    }

    this.index++;
  }

  private resetHandler () {
    this.key             = '';
    this.value           = '';
    this.recording       = RecordingType.Key;
    this.valueStartIndex = 0;
  }

  private handleCharCases (char : string) {
    switch (char) {
      case '{':
        if (!this.hasEnv) {
          this.resetHandler();
        }
        this['{}']++;
        break;
      case '}':
        this.attemptCompleteValue();
        this['{}']--;
        break;
      case '[':
        this['[]']++;
        break;
      case ']':
        this['[]']--;
        break;
      case '(':
        this['()']++;
        break;
      case ')':
        this['()']--;
        break;
      case '"':
        this['""'] = !this['""'];
        break;
      case '\'':
        this['\'\''] = !this['\'\''];
        break;
      case '\\':
        this.index++;
        break;
      case ',':
        this.attemptCompleteValue();
        break;
      case ':':
        this.attemptCompleteKey();
        break;
    }
  }

  private attemptCompleteValue () {
    if (this.hasEnv && this.equalEnvDepth) {
      this.value = this.value.slice(0, -1);
      this.performReplacement();
      this.resetHandler();
    }

    if (!this.hasEnv) {
      this.resetHandler();
    }
  }

  private attemptCompleteKey () {
    if (this.recording !== RecordingType.Key) {
      return;
    }

    // remove the : from the key
    this.key = this.key.slice(0, -1);

    // this is the beginning of the value index
    this.valueStartIndex = this.index + 1;

    let key = this.key.trim();

    if (!key.length) {
      throw new Error('Received a `:` but there has been no key received');
    }

    if (key.includes('\'') || key.includes('"')) {
      try {
        key = JSON.parse(key);
      }
      catch (e) {
        throw new Error('Received a key with quotes, but am unable to deserialize it');
      }
    }

    this.ENV_VALUE = envValue(key);
    this.ENV_DEPTH = this['{}'];

    if (this.debug) {
      console.log('KEY', key, this.ENV_DEPTH, this.ENV_VALUE);
    }

    this.recording = RecordingType.Value;
  }

  private performReplacement () {
    if (isUndefined(this.ENV_VALUE)) {
      return;
    }

    const endspace   = /[\s\n]*$/.exec(this.value);
    const startspace = /^[\s\n]*/.exec(this.value);

    if (!endspace || !startspace) {
      throw new Error('No matches found');
    }

    const replacement = `${ startspace[0] }${ JSON.stringify(this.ENV_VALUE) }${ endspace[0] }`;

    if (this.debug) {
      console.log('PERFORMING REPLACEMENT', replacement, this.value);
    }

    // Perform the replacement of the string
    this.string = this.string.slice(
      0,
      this.valueStartIndex,
    ) + replacement + this.string.slice(this.valueStartIndex + this.value.length);
    const diff  = replacement.length - this.value.length;

    this.index += diff;
  }
}
