// place files you want to import through the `$lib` alias in this folder.

export interface IReportedResults{
  execution_time: number,
  number_http_request: number,
  alignment_kg: string
}

export interface IQueryState{
  queryIsRunning:boolean;
  error:string|undefined;
  results:Record<string, string>[];
  executionTime: number | undefined;
  numberOfHttpRequest: number | undefined;
  alignmentKg: string | undefined;
};

export function emptyQueryState(): IQueryState{
  return {
    queryIsRunning: false,
    error: undefined,
    results: [],
    executionTime: undefined,
    numberOfHttpRequest:undefined,
    alignmentKg: undefined
  };
}
export function resetQueryState(queryState:IQueryState):void{
  queryState.queryIsRunning = false;
  queryState.error = undefined;
  queryState.results = [];
  queryState.executionTime = undefined;
  queryState.numberOfHttpRequest = undefined;
  queryState.alignmentKg = undefined;
}

export interface WorkerMessage {
  type: string;
  payload: any;
}

export interface WorkerQueryMessage extends WorkerMessage {
  type: "query";
  payload: {
    query: string;
    rules: string;
    schemaAlignment: boolean;
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
  result: IReportedResults;
}

export interface WorkerErrorResponse {
  type: "error";
  result: string;
}
