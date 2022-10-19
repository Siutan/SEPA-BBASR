<script>
  export let open = false;
  import { slide } from 'svelte/transition';
  const handleClick = () => open = !open
</script>

<div class="m-1">
  <div class="flex w-full">
    <div class="flex mr-1" on:click={handleClick}>
      <slot name="head"></slot>
    </div>

    <button class="outline-none" on:click={handleClick} >
      {#if open}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
        </svg>
      {:else}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      {/if}
    </button>
  </div>

  {#if open}
    <div class="pt-5" transition:slide>
      <slot name="details">
      </slot>
    </div>
  {/if}
</div>

<style>
</style>
