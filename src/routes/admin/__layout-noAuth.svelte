<script lang="ts">
  import '$lib/tailwind.css'
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
            console.log("Already Logged in");
            goto("/");
            authenticated = true;

          } else {
            console.log("Not logged in");
            
            authenticated = false;
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });

        return authenticated
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

      <!-- If already authenticated render a dark screen as page will be redirected -->
      {#if authenticated}

        <div class="flex h-screen bg-gray-50 dark:bg-gray-900"></div>
        
      <!-- Else not authenticated then the login page will be loaded  -->
      {:else}
        <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
      
          <div class="flex flex-col flex-1 w-full">
            <!-- <Header /> -->
      
            <slot />
          </div>
        </div>
      {/if}
    
    <!-- If any errors are thrown from the promise render a black page with the error -->
    {:catch error}
      <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
        <p>failed to load page {error}</p>
      </div>  
    {/await}
  </section>
  