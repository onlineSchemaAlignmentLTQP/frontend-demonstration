// place files you want to import through the `$lib` alias in this folder.

export type SerializedRules = Map<string, string>;

export interface WorkerMessage {
  type: string;
  payload: any;
}

export interface WorkerQueryMessage extends WorkerMessage {
  type: "query";
  payload: {
    query: string;
    rules: SerializedRules;
  };
}

export interface WorkerResponse {
  type: string;
  result: any;
}

export interface WorkerQuadResponse {
  type: "quad";
  result: string;
}
export interface WorkerEndResponse {
  type: "end";
  result: {
    execution_time:number
  };
}

export interface WorkerErrorResponse {
  type: "error";
  result: string;
}
