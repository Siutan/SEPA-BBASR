<script lang="ts">
  import StatusCircle from "../../../lib/components/StatusCircle.svelte";
  import Input from "../../../lib/components/Input.svelte";
  import Switch from "../../../lib/components/Switch.svelte";

  let users;
  let selectedUser = {
    "employeeId": "",
    "givenName": "",
    "lastName": "",
    "password": "",
    "companyEmail": "",
    "admin": null
  };

  async function getUsers() {
    await fetch("https://dairies-rest-api.herokuapp.com/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      mode: "cors"
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        users = data;
      });
  }

  // capitalize function
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

</script>

<svelte:head>
  <title>Manage Users</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Manage Users</h2>
    <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      {#await getUsers()}
        <div>...waiting</div>
      {:then data}
        <div class="grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-2">
          <div class="w-full overflow-x-auto col-span-2 ">
            <table class="w-full whitespace-no-wrap">
              <thead>
              <tr
                class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
              >
                <th class="px-4 py-3">Employee ID</th>
                <th class="px-4 py-3">Given Name</th>
                <th class="px-4 py-3">Last Name</th>
                <th class="px-4 py-3">Admin</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {#each users as user}
                <tr
                  class="text-gray-700 dark:text-gray-400 hover:bg-gray-700"
                  on:click={() => selectedUser = user}
                >
                  <td class="px-4 py-3">
                    <div class="flex items-center text-sm">
                      <div>
                        <p class="font-semibold">{user.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm">{capitalize(user.givenName)}</td>
                  <td class="px-4 py-3 text-sm">{capitalize(user.lastName)}</td>
                  <td class="px-4 py-3 text-xs">

                    {#if user.admin}
                      <StatusCircle status="success" />
                    {:else}
                      <StatusCircle status="danger" />
                    {/if}
                  </td>
                </tr>
              {/each}
              </tbody>
            </table>
          </div>
          <!-- Claim details -->
          <div class="flex flex-col border-2 border-gray-700 rounded-lg p-1">
            <div>
              <p class="text-center font-semibold text-yellow-400 dark:text-yellow-300 m-4">⚠️This is sensitive
                information.
                Access will be monitored</p>
            </div>
            <div>
              <div class="text-center">
                <div id="customerForm" class="p-5 flex flex-col flex-wrap gap-5">
                  <div class="">
                    <div class="w-full">
                      <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Account Information
                      </h1>
                      <div class="grid xl:grid-cols-2 xl:gap-6">
                        <div class="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="givenName"
                            id="floating_givenName"
                            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                            placeholder=" "
                            value={selectedUser.givenName}
                          />
                          <label
                            for="floating_givenName"
                            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >First Name</label
                          >
                        </div>
                        <div class="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="lastName"
                            id="floating_lastName"
                            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                            placeholder=" "
                            value={selectedUser.lastName}
                          />
                          <label
                            for="floating_lastName"
                            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >Last Name</label
                          >
                          </div>
                        </div>
                      </div>
                      <div class="relative z-0 w-full mb-6">
                        <input
                          type="text"
                          name="make"
                          id="floating_email"
                          class=" vehicle block py-2.5 px-0 text-sm w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                          placeholder=" "
                          value={selectedUser.companyEmail}
                        />
                        <label
                          for="floating_email"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Company Email</label
                        >
                        <div class="text-red-600 pt-3">
                        </div>
                      </div>
                      <div class="relative z-0 w-full mb-6 group">
                        <input
                          type="text"
                          name="make"
                          id="floating_id"
                          class=" vehicle block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                          placeholder=" "
                          value={selectedUser.employeeId}
                        />
                        <label
                          for="floating_id"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Employee ID</label
                        >
                      </div>
                      <div>
                        <Switch value="{!!selectedUser.admin}"
                                label="Admin" design="slider" />
                      </div>

                      <!-- Change to button  -->
                      <button
                        class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"

                      >
                        Update account
                      </button>
                      <hr class="my-8" />
                      <!-- Do we need this? -->

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {:catch error}
        <div>{error.message}</div>
      {/await}
    </div>
  </div>
</main>
