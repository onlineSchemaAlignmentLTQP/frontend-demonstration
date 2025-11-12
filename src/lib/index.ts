// place files you want to import through the `$lib` alias in this folder.
import type { Snippet } from 'svelte';

export interface IScenario{
  step: number;
  title: string;
  content: Snippet;
  selectedIcon: string[];
}

export interface IReportedResults {
  execution_time: number;
  number_http_request: number;
  alignment_kg: string;
}

export interface IQueryState {
  queryIsRunning: boolean;
  error: string | undefined;
  results: Record<string, string>[];
  executionTime: number | undefined;
  numberOfHttpRequest: number | undefined;
  alignmentKg: string | undefined;
}

export function emptyQueryState(): IQueryState {
  return {
    queryIsRunning: false,
    error: undefined,
    results: [],
    executionTime: undefined,
    numberOfHttpRequest: undefined,
    alignmentKg: undefined,
  };
}
export function resetQueryState(queryState: IQueryState): void {
  queryState.queryIsRunning = false;
  queryState.error = undefined;
  queryState.results = [];
  queryState.executionTime = undefined;
  queryState.numberOfHttpRequest = undefined;
  queryState.alignmentKg = undefined;
}

export interface WorkerQueryPayload {
  query: string;
  rules: string;
  schemaAlignment: boolean;
}

export interface WorkerQueryMessage {
  type: "query";
  payload: WorkerQueryPayload;
}

export interface WorkerResponse<T> {
  type: string;
  result: T;
}

export interface WorkerBindingResponse extends WorkerResponse<string> {
  type: "binding";
  result: string;
}
export interface WorkerEndResponse extends WorkerResponse<IReportedResults> {
  type: "end";
  result: IReportedResults;
}

export interface WorkerErrorResponse extends WorkerResponse<string> {
  type: "error";
  result: string;
}
