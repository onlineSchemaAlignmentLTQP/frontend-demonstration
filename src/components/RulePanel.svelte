<script lang="ts">
  import { onMount } from "svelte";
  import { basicSetup } from "codemirror";
  import { EditorView } from "@codemirror/view";
  import { EditorState, Compartment } from "@codemirror/state";
  import { turtle } from "codemirror-lang-turtle";
  import {
    RULES,
    EVENT_TARGET,
    CHANGE_RULE_EVENT,
    CHANGE_SCHEMA_ALIGNMENT_STATE_EVENT,
  } from "../state.svelte";

  let editor: HTMLElement | undefined;
  const exampleRules = `@prefix ex: <https://exemple.com#> .
@prefix semmap: <https://semanticmapping.org/vocab#> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .

[]
    a semmap:RuleSet ;
    # Defines where the rules apply. "*" means the rules are valid for all subwebs.
    semmap:subweb "*" ;
    # Lists any rules disable by the engine.
    # See https://mapping-commons.github.io/sssom/spec-model/ for the list of all the valid rules.
    semmap:disallowedRules (ex:randomAlignment) ;
    # Declares the rules included in this rule set.
    semmap:rule _:rule1 .

_:rule1
    # RDF term that serves as the starting point for the alignment.
    semmap:premise ex:foo ;
    # The semantic relationship between the premise and conclusion.
    # See https://mapping-commons.github.io/sssom/spec-model/ for the list of all the valid rules.
    semmap:inference skos:exactMatch ;
    # RDF term that the premise is aligned to.
    semmap:conclusion ex:bar .
  `;

  RULES.kg = exampleRules;
  const readOnly = new Compartment();

  onMount(() => {
    let initialRules: string = exampleRules;
    const storedRules = localStorage.getItem("rules");
    if (storedRules !== null) {
      initialRules = storedRules;
    }
    RULES.kg = initialRules;
    const view = new EditorView({
      doc: initialRules,
      parent: editor!,
      extensions: [
        basicSetup,
        turtle(),
        readOnly.of(EditorState.readOnly.of(false)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const text = update.state.doc.toString();
            RULES.kg = text;
            localStorage.setItem("rules", text);
          }
        }),
      ],
    });
    EVENT_TARGET.addEventListener(CHANGE_RULE_EVENT, ((e: CustomEvent<string>) => {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: e.detail,
        },
      });
    }) as EventListener);

    EVENT_TARGET.addEventListener(CHANGE_SCHEMA_ALIGNMENT_STATE_EVENT, ((
      e: CustomEvent<boolean>
    ) => {
      view.dispatch({
        effects: readOnly.reconfigure(EditorState.readOnly.of(!e.detail)),
      });
      if (!e.detail == true) {
        editor!.classList.add("disable");
      } else {
        editor!.classList.remove("disable");
      }
    }) as EventListener);
  });
</script>

<div bind:this={editor} class="editor"><!-- code mirror --></div>

<style>
  .editor {
    width: 50%;
    height: 100%;
    border: 1px solid #d1d1d1;
  }
  :global(.cm-editor) {
    height: 100%;
  }

  :global(.cm-editor .readOnly) {
    background-color: #cccccc;
  }

  :global(.disable) {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
    color: #6c757d;
  }
</style>
