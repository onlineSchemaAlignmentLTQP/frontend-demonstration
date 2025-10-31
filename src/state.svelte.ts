import { emptyQueryState, type IQueryState } from "$lib";

export interface IRuleInput{
  kg:string
}

export const QUERY_STATE: IQueryState = $state(emptyQueryState());

export const EVENT_TARGET = $state(new EventTarget());

export const RULES:IRuleInput = $state({kg:""});


export const PROPOSED_QUERY_EVENT = "proposedQuery";

export const CHANGE_SCHEMA_ALIGNMENT_STATE = "schemaAlignmentState";
