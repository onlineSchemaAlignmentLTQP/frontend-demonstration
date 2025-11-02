import { emptyQueryState, type IQueryState } from "$lib";

export interface IRuleInput{
  kg:string
}

export interface IChangeNetwork{
  previousNetwork: string;
  newNetwork: string;
}

export enum AlertType{
  Info,
  Error,
  None
}

export interface IAlert{
  type: AlertType;
  message?: string;
}

export const QUERY_STATE: IQueryState = $state(emptyQueryState());

export const EVENT_TARGET = $state(new EventTarget());

export const RULES:IRuleInput = $state({kg:""});

export const ALERT: IAlert = $state({type:AlertType.None});

export const PROPOSED_QUERY_EVENT = "proposedQuery";

export const CHANGE_SCHEMA_ALIGNMENT_STATE_EVENT = "schemaAlignmentState";

export const CHANGE_NETWORK_EVENT = "changeNetwork";
