<script>
    import {createEventDispatcher} from "svelte";

    let dispatch = createEventDispatcher();
    

    export let selectedUser;
   

    let newPass = "";

    let placeholder = 'Please select a user status';

    let options = [{
    label: "Admin",
    value: true
  }, {
    label: "User",
    value: false
  }];

   // loading text
  export let updateButtonText = "Update User";
  export let deleteButtonText = "Deactivate User";
  export let reactivateButtonText = "Reactivate User";

  
  // delete user
  async function reactivateAccount() {
    reactivateButtonText = "Reactivating user...";
    dispatch("reactivateAccount", selectedUser)

    
  }

  // reactivate user
  async function deleteAccount() {
    deleteButtonText = "Deactivating user...";
    dispatch("deleteAccount", selectedUser)
  }

  // update account
  async function updateAccount() {
    //updateButtonText = "Updating User...";
    let user = {
      "employeeId": selectedUser.employeeId,
      "givenName": selectedUser.givenName,
      "lastName": selectedUser.lastName,
      "companyEmail": selectedUser.companyEmail,
      "admin": selectedUser.admin,
      "password": newPass
    };
    
    dispatch("updateAccount", user);

  }
</script>

 <!-- User details -->
 <div class="flex flex flex-col border-2 border-gray-300 dark:border-gray-700 rounded-lg p-1">
    <div>
      <p class="text-center font-semibold text-yellow-400 dark:text-yellow-300 m-4">⚠️This is sensitive
        information.
        Access will be monitored</p>
    </div>
    <div>
      <div class="text-left">
        <div id="customerForm" class="p-5 flex flex-col flex-wrap gap-5">
          <div class="">
            <div class="w-full">
              <h1 class="mb-4 text-xl text-center font-semibold text-gray-700 dark:text-gray-200">
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