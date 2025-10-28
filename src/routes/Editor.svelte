<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { type Yasqe as YasqeType } from "@triply/yasqe";
    import { QueryEngine } from "query-sparql-link-traversal-solid-schema-alignment";
    import type * as RDF from "@rdfjs/types";
    import { type WorkerMessage, type WorkerResponse } from "$lib";

    let yasguiDiv: HTMLElement | undefined;
    let yasqe: YasqeType | undefined;
    let result: number | null = null;
    let worker: Worker;

    onMount(async () => {
        // Create a worker instance
        worker = new Worker(new URL("$lib/worker.ts", import.meta.url), {
            type: "module",
        });

        // Listen for messages from the worker
        worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
            result = event.data.result;
            console.log(result);
        };

        // Send a message to the worker
        const message: WorkerMessage = { type: "query", query: "42" };
        worker.postMessage(message);

        const engine = new QueryEngine();

        const Yasqe = (await import("@triply/yasqe")).default;
        yasqe = new Yasqe(yasguiDiv!, {
            showQueryButton: true,
        });

        yasqe.on("query", async (instance: YasqeType) => {
            const query = instance.getValue();
            const results: RDF.Bindings[] = [];
            const rules: RDF.Quad[] = [];

            console.log(query);

            const start = performance.now();
            const bindingsStream = await engine.queryBindings(query, {
                lenient: true,
                "@comunica/actor-context-preprocess-query-source-reasoning:rules":
                    new Map([["*", rules]]),
                "@comunica/actor-context-preprocess-query-source-reasoning:activate": true,
            });

            bindingsStream.on("data", (binding: RDF.Bindings) => {
                const result = JSON.parse(binding.toString());
                console.log("yep!");
                const arrival = performance.now();
                results.push({
                    ...result,
                    _arrival_time: arrival - start,
                });
            });

            bindingsStream.on("error", (err) => {
                console.error(err);
                console.log({
                    results: err,
                    execution_time: undefined,
                });
            });

            bindingsStream.on("end", () => {
                const end = performance.now();
                console.log({
                    results,
                    execution_time: end - start,
                });
            });
        });
    });

    onDestroy(() => {
        // Terminate the worker when the component unmounts
        //worker.terminate();
    });
</script>

<div bind:this={yasguiDiv}></div>

<style>
    .yasgui .autocompleteWrapper {
        display: none !important;
    }
</style>
