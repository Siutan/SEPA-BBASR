<script lang="ts">
  import "$lib/tailwind.css";
  import { isSideMenuOpen, closeSideMenu } from "$stores/menus";
  import { clickOutside } from "$lib/ioevents/click";
  import { keydownEscape } from "$lib/ioevents/keydown";
  import SideBar from "$lib/templates/Admin/SideBar.svelte";
  import Header from "$lib/templates/Admin/Header.svelte";
  import { goto } from "$app/navigation";

   //function checks auth endpoint to determine if user is already logged in
  async function authenticate(){

    let authenticated:boolean = false;

      await fetch("https://dairies-rest-api.herokuapp.com/auth", {
          method: "GET",
          credentials: "include",
          mode: "cors"
        })
        .then(response => {
          console.log(response.status);
          if (response.status === 200) {
            console.log("Logged in");
            authenticated = true;

          } else {
            console.log("Not logged in");
            goto("/auth/login");
            authenticated = false;
          }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    return authenticated;

  } 

  //Create a promise from calling the authenticate function
  let promise = authenticate();

</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
</svelte:head>


<section id="body" class="dark">

  <!-- await the promise from the authentication  -->
  {#await promise}

   <!-- while waiting render a dark screen so less jaring -->
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900"></div>
  
  <!-- When the promise is returned check if authenticated is true or false  -->
  {:then authenticated}

    <!-- If the user is authenticatted load the dashboard -->
    {#if authenticated}

      <div class="flex h-screen bg-gray-50 dark:bg-gray-900" class:overflow-hidden={$isSideMenuOpen}>
        <!-- Desktop sidebar -->
        <aside
          class="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0"
        >
          <SideBar />
        </aside>

        <!-- Mobile sidebar -->
        <!-- Backdrop -->
        {#if $isSideMenuOpen}
          <div
            class="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
          />
          <aside
            class="fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden"
            use:clickOutside={['nav-mobile-hamburger']}
            on:click-outside={closeSideMenu}
            use:keydownEscape
            on:keydown-escape={closeSideMenu}
          >
            <SideBar />
          </aside>
        {/if}

        <div class="flex flex-col flex-1 w-full">
          <Header />

          <slot />
        </div>
      </div>

    <!-- Else render a dark screen as the page will be redirected  -->
    {:else}
      <div class="flex h-screen bg-gray-50 dark:bg-gray-900"></div>
    {/if}
   
    <!-- If any errors are thrown from the promise render a black page with the error -->
    {:catch error}
      <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
        <p>failed to load page {error}</p>
      </div>  
    {/await}

</section>
