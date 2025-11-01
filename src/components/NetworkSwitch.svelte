<script lang="ts">
  import { onMount } from "svelte";
  import { ButtonGroup, Button, Color } from "flowbite-svelte";
  import configFile from "../../config.json?raw";
  import { CURRENT_QUERY_CHANGE_EVENT, EVENT_TARGET } from "../state.svelte";

  type ButtonColor = 'alternative' | 'blue' | 'dark' | 'green' | 'light' | 'primary' | 'purple' | 'red' | 'yellow' | 'none';

  const defaultColor:ButtonColor = "light";
  const activatedColor: ButtonColor = "green";

  let colorButtonMultipleVocabulary:ButtonColor = "light";
  let colorButtonOutside: ButtonColor= "light";
  let colorButtonSingleVocabulary: ButtonColor = "light";


  const config = JSON.parse(configFile);
  const normalNetworkHostName:string = config["normalNetworkHostName"];
  const multipleVocabHostName:string = config["multipleVocabHostName"];


  onMount(()=>{
    EVENT_TARGET.addEventListener(CURRENT_QUERY_CHANGE_EVENT, ((e: CustomEvent<string>)=>{
      const query = e.detail;
      if(query.includes(normalNetworkHostName)){
        colorButtonSingleVocabulary = activatedColor;
        colorButtonMultipleVocabulary =defaultColor;
        colorButtonOutside = defaultColor;
      } else if(query.includes(multipleVocabHostName)){
        colorButtonSingleVocabulary = defaultColor;
        colorButtonMultipleVocabulary =activatedColor;
        colorButtonOutside = defaultColor;
      }else{
        colorButtonSingleVocabulary = defaultColor;
        colorButtonMultipleVocabulary = defaultColor;
        colorButtonOutside = activatedColor;
      }
    }) as EventListener);

  });
</script>

<ButtonGroup class="*:ring-primary-700!">
  <Button color={colorButtonMultipleVocabulary}>Multiple Vocabulary</Button>
  <Button color={colorButtonOutside}>Outside</Button>
  <Button color={colorButtonSingleVocabulary}>Single Vocabulary</Button>
</ButtonGroup>
