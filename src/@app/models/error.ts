export interface ResponseObjectError {
  errors: {
    [k: string]: Array<string[]>;
  };
}
