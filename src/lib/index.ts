// place files you want to import through the `$lib` alias in this folder.

export interface IQueryState{
  queryIsRunning:boolean;
  error:string|undefined;
  results:Record<string, string>[];
  executionTime: number|undefined
};

export function emptyQueryState(): IQueryState{
  return {
    queryIsRunning: false,
    error: undefined,
    results: [],
    executionTime: undefined
  };
}
export function resetQueryState(queryState:IQueryState):void{
  queryState.queryIsRunning = false;
  queryState.error = undefined;
  queryState.results = [];
  queryState.executionTime = undefined;
}
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

export interface WorkerBindingResponse {
  type: "binding";
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
