<script lang="ts">
  import { Footer, FooterCopyright, FooterLinkGroup } from "flowbite-svelte";
  import { GithubSolid } from "flowbite-svelte-icons";
</script>

<div class="app-footer">
    <Footer style="padding-top:0.5vh; padding-bottom:0.5vh">
      <FooterCopyright
        href="https://www.linkedin.com/in/bryanelliotttam/"
        by="Bryan-Elliott Tam"
        copyrightMessage="CC0 1.0 Universal license"
        year={2026}
      />
      <FooterLinkGroup
        class="mt-3 flex flex-wrap items-center justify-center text-sm text-gray-500 sm:mt-0 dark:text-gray-400"
      >
        <GithubSolid
          onclick={() => window.open("https://github.com/onlineSchemaAlignmentLTQP/demo", "_blank")}
          class="h-10 w-25 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
        />
      </FooterLinkGroup>
    </Footer>
</div>


<style>
    :global(.app-footer footer span a){
        color: #0000EE;
        text-decoration: underline;
    }

    :global(.app-footer footer span a:hover){
        cursor: pointer;
    }
</style>
