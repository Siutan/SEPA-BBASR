<script lang="ts">
  import '$lib/tailwind.css'
  import { goto } from "$app/navigation";

  const BASE_URL = import.meta.env.VITE_BASE_URL
  
  //function checks auth endpoint to determine if user is already logged in
  async function authenticate(){
    let authenticated:boolean = false;
        await fetch(`${BASE_URL}/auth`, {
          method: "GET",
          credentials: "include",
          mode: "cors"
        })
        .then(response => {
          
          if (response.status === 200) {
            
            goto("/");
            authenticated = true;

          } else {
            
            
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
      <div class="flex grid justify-items-center h-screen bg-gray-50 dark:bg-gray-900">
         <!-- loading -->
         <div class="flex items-center justify-items-center content-center justify-center">
          <div role="status">
            <svg aria-hidden="true" class="mr-2 w-40 h-40 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill" />
            </svg>
            <span class="sr-only">Loading...</span>
            <div class="flex items-center justify-center mt-2">Loading Page...</div>
          </div>
        </div>
      </div>

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
  