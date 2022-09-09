<script>
    import {createEventDispatcher} from 'svelte';
    
    let dispatch = createEventDispatcher();

    let field = "";
    export let id = "";
    export let name = "";
    export let label = "";
    export let type = "text";
    let showPassword = false;

    const toggle = () => {
      showPassword = !showPassword;
      let inputType
      if(showPassword){
        inputType = "text"
      }
      else{
        inputType = "password"
      }
      let input = document.getElementById(`${id}`);
      input.type = inputType;
    }

    function dispatchField(){
        dispatch(`dispatch`,field);
    }

</script>

<div class="relative z-0 w-full mb-6 group">
    {#if type === "password"}
      <div class="absolute inset-y-0 right-0 flex items-center px-2">
        {#if showPassword == true}
          <svg on:click={toggle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        {:else}
          <svg on:click={toggle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        {/if}
      </div>
      <input
        type="password"
        name="{name}"
        id="{id}"
        class="vehicle block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
        placeholder=" "
        bind:value={field}
        on:focusout={dispatchField}
      />
    {:else}
      <input
      type="text"
      name="{name}"
      id="{id}"
      class="vehicle block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
      placeholder=" "
      bind:value={field}
      on:focusout={dispatchField}
    />
    {/if}
    <label
      for="{name}"
      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >{label}</label>
    <div class="text-red-600 pt-3">
        <slot></slot> 
    </div>
</div>

<style>

</style>
