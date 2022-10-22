<script lang="ts">
  import { clickOutside } from "$lib/ioevents/click";
  import { keydownEscape } from "$lib/ioevents/keydown";
  import { createEventDispatcher } from "svelte";


  let dispatch = createEventDispatcher();

  export let title = "";
  export let isModalOpen = false;

  //Closes the modal
  const closeModal = () => {
    dispatch("closeModal", false);
  };


</script>
{#if isModalOpen}

  <div class="backdrop">
    <div class="">
      <div
        use:clickOutside
        on:click-outside={closeModal}
        use:keydownEscape
        on:keydown-escape={closeModal}
        class="modal bg-gray-50 dark:bg-gray-800 outline outline-purple-600 rounded-lg">
        <div class="grid">
          <header on:click={closeModal} class="cursor-pointer justify-self-end text-2xl">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" role="img" aria-hidden="true">
              <path
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              />
            </svg>
          </header>
        </div>

        <div>

        </div>

        <slot></slot>
        <footer
          class="grid"
        >
          <button
            on:click={closeModal}
            class="justify-self-end w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  </div>


{/if}

<style>
    .backdrop {
        position: fixed;
        z-index: 100; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */

    }
    /* For Small Screens */
    @media only screen and (max-width: 600px) {
      .modal {
          margin: 5% 5%; 
          padding: 10px;
          width: 90%;
      }
    }

    /* For Big Screens */
    @media only screen and (min-width: 601px) {
    .modal {
        margin: 5% 17%; 
        padding: 10px;
        width: 75%;
    }
  }
</style>