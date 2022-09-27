<script lang="ts">
  import StatusCircle from "../../../lib/components/StatusCircle.svelte";
  import CreateAccount from "../../../lib/components/auth/CreateAccount.svelte";
  import { clickOutside } from "$lib/ioevents/click";
  import { keydownEscape } from "$lib/ioevents/keydown";

  // modal stuff
  let isModalOpen = false;

  // loading text
  let updateButtonText = "Update User";
  let deleteButtonText = "Deactivate User";
  let reactivateButtonText = "Reactivate User";

  const openModal = () => {
    isModalOpen = true;
  };

  const closeModal = () => {
    isModalOpen = false;
  };

  let users;
  let selectedUser = {
    "employeeId": "",
    "givenName": "",
    "lastName": "",
    "password": "",
    "companyEmail": "",
    "admin": false,
  };

  let placeholder = 'Please select a user status';

  let options = [{
    label: "Admin",
    value: true
  }, {
    label: "User",
    value: false
  }];

  let newPass = "";


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
        users = data;
        fetch("https://dairies-rest-api.herokuapp.com/user/inactive", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          mode: "cors"
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(users);
            users = [...users, ...data];
          });
      });
  }

  // delete user
  async function reactivateAccount() {
    reactivateButtonText = "Reactivating user...";
    await fetch("https://dairies-rest-api.herokuapp.com/user/reactivate/" + selectedUser.employeeId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      mode: "cors"
    })
      .then((response) => response.json())
      .then((data) => {
        getUsers();
        reactivateButtonText = "Reactivate User";
      });
  }

  // reactivate user
  async function deleteAccount() {
    deleteButtonText = "Deactivating user...";
    await fetch("https://dairies-rest-api.herokuapp.com/user/deactivate/" + selectedUser.employeeId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      mode: "cors"
    })
      .then((response) => response.json())
      .then((data) => {
        getUsers();
        deleteButtonText = "Deactivate User";
      });
  }

  // update account
  async function updateAccount() {
    updateButtonText = "Updating User...";
    let user = {
      "employeeId": selectedUser.employeeId,
      "givenName": selectedUser.givenName,
      "lastName": selectedUser.lastName,
      "companyEmail": selectedUser.companyEmail,
      "admin": selectedUser.admin,
      "password": newPass
    };
    await fetch("https://dairies-rest-api.herokuapp.com/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(user)
    })
      .then((response) => response.json())
      .then((data) => {
        getUsers();
        updateButtonText = "Update User";
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
        <!-- loading -->
        <div class="flex items-center justify-center">
          <div role="status">
            <svg aria-hidden="true" class="mr-2 w-40 h-40 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Loading...</span>
            <div class="flex items-center justify-center mt-2">Loading Data...</div>
          </div>
        </div>
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
                <th class="px-4 py-3">Active</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {#each users as user}
                <tr
                  class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-700"
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
                  <td class="px-4 py-3 text-sm">{user.active}</td>
                </tr>
              {/each}
              <div
                class:hidden={!isModalOpen}
                class="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
              >
                <!-- Modal -->
                <div
                  class:hidden={!isModalOpen}
                  use:clickOutside
                  on:click-outside={closeModal}
                  use:keydownEscape
                  on:keydown-escape={closeModal}
                  class="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
                  role="dialog"
                  id="modal"
                >
                  <!-- Remove header if you don't want a close icon. Use modal body to place modal tile. -->
                  <header class="flex justify-end">
                    <button
                      class="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
                      aria-label="close"
                      on:click={closeModal}
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" role="img" aria-hidden="true">
                        <path
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </header>
                  <!-- Modal body -->
                  <div class="mt-4 mb-6">
                    <!-- Modal description -->
                    <CreateAccount/>
                  </div>
                </div>
              </div>
              <tr
                class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-700"
                on:click={openModal}
              >
                  <td class="px-4 py-3">
                    <div class="flex items-center text-sm">
                      <div>
                        <p class="font-semibold">+ Add New User</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm"></td>
                  <td class="px-4 py-3 text-sm"></td>
                  <td class="px-4 py-3 text-xs"></td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- Claim details -->
          <div class="flex flex-col border-2 border-gray-300 dark:border-gray-700 rounded-lg p-1">
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
                            bind:value={selectedUser.givenName}
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
                            bind:value={selectedUser.lastName}
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
                          bind:value={selectedUser.companyEmail}
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
                          bind:value={selectedUser.employeeId}
                        />
                        <label
                          for="floating_id"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Employee ID</label
                        >
                      </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <input
                        type="password"
                        name="make"
                        id="floating_pass"
                        class=" vehicle block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                        placeholder=" "
                        bind:value={newPass}
                      />
                      <label
                        for="floating_id"
                        class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >Password</label
                      >
                    </div>
                      <div>
                        <select
                          id="floating_select"
                          bind:value={selectedUser.admin}
                          class="block w-full py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600"
                        >
                          {#if placeholder}
                            <option class="text-gray-900 dark:text-white" value="" disabled selected>{placeholder}</option>
                          {/if}
                          {#each options as option}
                            <option class="text-gray-900 dark:text-white" value={option.value}>
                              {option.label || option.text}
                            </option>
                          {/each}
                        </select>
                        <label
                          for="floating_select"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Employee Status</label
                        >
                      </div>

                      <!-- Change to button  -->
                      <button
                        class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                        on:click={() => {
                          updateAccount()
                          newPass = ""
                        }}
                      >
                        {updateButtonText}
                      </button>
                      <hr class="my-8" />

                      {#if selectedUser.active}
                        <button
                          class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-300 hover:bg-red-800 focus:outline-none focus:shadow-outline-purple"
                          on:click={() => {
                          deleteAccount()
                          newPass = ""
                        }}
                        >
                          {deleteButtonText}
                        </button>
                      {:else}
                        <button
                          class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-orange-500 border border-transparent rounded-lg active:bg-orange-300 hover:bg-orange-600 focus:outline-none focus:shadow-outline-purple"
                          on:click={() => {
                          reactivateAccount()
                          newPass = ""
                        }}
                        >
                          {reactivateButtonText}
                        </button>
                      {/if}
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
