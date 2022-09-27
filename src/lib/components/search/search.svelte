<script>
  import {term} from "../../../stores/search";
  let val = '';

  $: term.set(val);
</script>

<div class="m-2">
  <div class="relative z-0 w-full mb-6 group">
    <input
      type="text"
      name="make"
      id="searchInput"
      class=" vehicle block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
      placeholder=" "
      bind:value={val}
    />
    <label
      for="searchInput"
      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
    >Search by Claim ID</label
    >
  </div>
</div>