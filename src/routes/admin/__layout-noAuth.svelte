<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export  const load: Load =  ({}) => {
      return {}

  }

</script>

<script lang="ts">
    import '$lib/tailwind.css'
    import { isSideMenuOpen, closeSideMenu } from '$stores/menus'
    import { clickOutside } from '$lib/ioevents/click'
    import { keydownEscape } from '$lib/ioevents/keydown'
    import SideBar from '$lib/templates/Admin/SideBar.svelte'
    import Header from '$lib/templates/Admin/Header.svelte'
    import { onMount } from 'svelte';
  import { goto } from "$app/navigation";

  onMount(() => {
    console.log("on mount called")

    fetch('https://dairies-rest-api.herokuapp.com/auth', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(response => {
        console.log(response.status);
        if (response.status === 200) {
          console.log("Logged in");
          //If already logged in redirect to dashboard
          goto('/');

        } else {
          console.log("Not logged in");
        }
      })

   
  });
  </script>
  
  <svelte:head>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
  </svelte:head>
  
  <section id="body" class="dark">
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900" class:overflow-hidden={$isSideMenuOpen}>
  
      <div class="flex flex-col flex-1 w-full">
        <!-- <Header /> -->
  
        <slot />
      </div>
    </div>
  </section>
  