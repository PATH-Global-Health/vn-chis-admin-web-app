export interface ResultRowError {
  row: number;
  code: string;
  error: string;
  raw_data: any;
}

export interface ResultError {
  code: string;
  errorMessage: string;
  raw_data: any;
}

export interface ResultData {
  total: number;
  succeed: number;
  updated: number;
  error_count: number;
  error_rows: ResultRowError[];
}

export interface Result {
  error: ResultError;
  data: ResultData;
  succeed: boolean;
}

export interface Detail {
  row: number;
  indicator?: string;
  site?: string;
  province?: string;
  code?: string;
  error?: string;
  raw_data?: any;
}

export interface ErrorLogging {
  id: string;
  result: Result;
  detail: Detail;
  rawData: any;
  dateTime: Date;
}

// #region Utilities
export interface ErrorFilter {
  code?: string;
  from?: string;
  to?: string;
}

export interface ErrorType {
  code: string;
  message: string;
}
// //#endregion
