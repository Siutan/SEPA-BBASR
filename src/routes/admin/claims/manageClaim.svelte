<script lang="ts">
  import { get } from "svelte/store";
  import { items } from "../../../stores/search";
  import { filtered } from "../../../stores/search";
  import Search from "../../../lib/components/search/search.svelte";
  import Switch from "../../../lib/components/Switch.svelte";
  import StatusCircle from "../../../lib/components/StatusCircle.svelte";
  import Modal from "../../../lib/components/Modal.svelte";
  import ClaimDetails from "../../../lib/components/ClaimModals/ClaimDetails.svelte";


  let claims;
  let selectedClaim = {};
  let detailedClaim = {};
  let detailedImage = "";

  let refreshText = "Refresh";


  // sort table by version
  let sortBy = { col: "version", ascending: true };

  $: sort = (column) => {
    if (sortBy.col == column) {
      sortBy.ascending = !sortBy.ascending;
    } else {
      sortBy.col = column;
      sortBy.ascending = true;
    }

    // Modifier to sorting function for ascending or descending
    let sortModifier = (sortBy.ascending) ? 1 : -1;

    let sort = (a, b) =>
      (a[column] < b[column])
        ? -1 * sortModifier
        : (a[column] > b[column])
          ? 1 * sortModifier
          : 0;

    items.set(claims.sort(sort));
  };


  async function getClaims() {
    refreshText = "Refreshing...";
    await fetch("https://dairies-rest-api.herokuapp.com/claims", {
      method: "GET",
      credentials: "include",
      mode: "cors"
    })
      .then((response) => response.json())
      .then((data) => {
        claims = data;
        items.set(data);
        refreshText = "Refresh";
      });
  }

  async function getDetailedClaim(claimId) {
    let url = "https://dairies-rest-api.herokuapp.com/claims/json/" + claimId;
    await fetch(url, {
      method: "GET",
      credentials: "include",
      mode: "cors"
    })
      .then((response) => response.json())
      .then((data) => {
        detailedClaim = data;
        console.log(detailedClaim);
        getImage(claimId);
        setClaimInputs();
      });

  }

  // get image from claim id
  async function getImage(claimId) {
    let url = "https://dairies-rest-api.herokuapp.com/claims/image/" + claimId;
    await fetch(url, {
      method: "GET",
      credentials: "include",
      mode: "cors"
    })
      // return data else catch error
      .then((response) => response.json())
      .then((data) => {
        detailedImage = data;
      })
      .catch((error) => {
        detailedImage = "";
      });
  }

  // function to change 2022-09-03T10:09:01.225Z to 03-09-2022
  function formatDate(date) {
    let d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();

    let year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  }

  //if updating claims
  let nonPolicyFirstName;
  let relationSelected;

  function setClaimInputs() {
    nonPolicyFirstName = detailedClaim["customer"]["nonPolicyFirstName"];
    relationSelected = detailedClaim["customer"]["nonPolicyRelation"];
  }

  // Modal
  let isModalOpen = false;
  let id;

  const openModal = (newId) => {

    isModalOpen = true;
    id=newId;
    console.log("Id is: ", id);
  };

  const closeModal = () => {

    isModalOpen = false;
  };


</script>

<svelte:head>
  <title>Manage claims</title>
</svelte:head>

<Modal {isModalOpen} title={`Claim ID: ${id}`} on:closeModal={closeModal} >
  <ClaimDetails ID={`${id}`} />
</Modal>

<main class="h-full pb-16 overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Manage Claims</h2>
    <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      {#await getClaims()}
        <!-- loading -->
        <div class="flex items-center justify-center">
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
            <div class="flex items-center justify-center mt-2">Loading Data...</div>
          </div>
        </div>
      {:then data}
        <div class="grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-2">
          <div class="w-full overflow-x-auto col-span-3 xl:col-span-2 ">
            <Search />
            <div>
              <button
                class="flex items-center gap-2 justify-between px-2 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                aria-label="Like"
                on:click={() => getClaims()}>
                <!-- refresh svg -->
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                     width="20" height="20"
                     viewBox="0 0 30 30"
                     style=" fill:#fff;">
                  <path
                    d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
                </svg>
                <span>{refreshText}</span>
              </button>
            </div>
            <table class="w-full whitespace-no-wrap">
              <thead>
              <tr
                class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
              >
                <th class="xl:px-4 py-3">Claim ID</th>
                <th on:click={() => {
                  sort("version")
                }} class="hidden xl:block xl:px-4 py-3 cursor-pointer select-none">Version
                </th>
                <th on:click={() => {
                  sort("Date")
                }} class="xl:px-4 py-3">Date
                </th>
                <th class="xl:px-4 py-3">Status</th>
                <th class="xl:hidden py-3">View</th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {#each $filtered as claim}
                <tr
                  class="text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-700"
                  on:click={() => {
                    selectedClaim = claim
                  }}
                >
                  <td class="px-4 py-3">
                    <div class="flex items-center text-sm">
                      <div>
                        <p class="font-semibold">{claim.claimID}</p>
                      </div>
                    </div>
                  </td>
                  <td class="hidden xl:block px-4 py-3 text-sm">{claim.version}</td>
                  <td class="px-4 py-3 text-sm">{formatDate(claim.createdAt)}</td>
                  <td class="px-4 py-3 text-xs">
                    <StatusCircle status={claim.status} />
                  </td>
                  <td class="xl:hidden">
                    <!-- eyeball svg -->
                    <div on:click={() => openModal(claim.claimID)}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="dark:fill-white"
                           x="0px" y="0px" width="20" height="20" viewBox="0 0 442.04 442.04" xml:space="preserve">
                            <g>
                              <g>
                                <path
                                  d="M221.02,341.304c-49.708,0-103.206-19.44-154.71-56.22C27.808,257.59,4.044,230.351,3.051,229.203    c-4.068-4.697-4.068-11.669,0-16.367c0.993-1.146,24.756-28.387,63.259-55.881c51.505-36.777,105.003-56.219,154.71-56.219    c49.708,0,103.207,19.441,154.71,56.219c38.502,27.494,62.266,54.734,63.259,55.881c4.068,4.697,4.068,11.669,0,16.367    c-0.993,1.146-24.756,28.387-63.259,55.881C324.227,321.863,270.729,341.304,221.02,341.304z M29.638,221.021    c9.61,9.799,27.747,27.03,51.694,44.071c32.83,23.361,83.714,51.212,139.688,51.212s106.859-27.851,139.688-51.212    c23.944-17.038,42.082-34.271,51.694-44.071c-9.609-9.799-27.747-27.03-51.694-44.071    c-32.829-23.362-83.714-51.212-139.688-51.212s-106.858,27.85-139.688,51.212C57.388,193.988,39.25,211.219,29.638,221.021z" />
                              </g>
                              <g>
                                <path
                                  d="M221.02,298.521c-42.734,0-77.5-34.767-77.5-77.5c0-42.733,34.766-77.5,77.5-77.5c18.794,0,36.924,6.814,51.048,19.188    c5.193,4.549,5.715,12.446,1.166,17.639c-4.549,5.193-12.447,5.714-17.639,1.166c-9.564-8.379-21.844-12.993-34.576-12.993    c-28.949,0-52.5,23.552-52.5,52.5s23.551,52.5,52.5,52.5c28.95,0,52.5-23.552,52.5-52.5c0-6.903,5.597-12.5,12.5-12.5    s12.5,5.597,12.5,12.5C298.521,263.754,263.754,298.521,221.02,298.521z" />
                              </g>
                              <g>
                                <path
                                  d="M221.02,246.021c-13.785,0-25-11.215-25-25s11.215-25,25-25c13.786,0,25,11.215,25,25S234.806,246.021,221.02,246.021z" />
                              </g>
                            </g>
                      </svg>
                    </div>
                  </td>
                </tr>
              {/each}
              </tbody>
            </table>
          </div>
          <!-- Claim details -->
          {#await getDetailedClaim(selectedClaim.claimID)}
            <!-- loading -->
            <div class="hidden xl:flex flex items-start justify-center">
              <div role="status">
                <svg aria-hidden="true"
                     class="mr-2 w-40 h-40 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor" />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
                <div class="flex items-center justify-center mt-2">Loading Data...</div>
              </div>
            </div>
          {:then x}
            <div class="hidden xl:flex flex-col border-2 border-gray-300 dark:border-gray-700 rounded-lg p-1">
              <div>
                <p class="text-center font-semibold text-yellow-400 dark:text-yellow-300 m-4">⚠️This is sensitive
                  information.
                  Access will be monitored</p>
              </div>
              <div class="text-left">
                <!-- Customer Info -->
                <div class="rounded-lg p-2 ml-2 mb-2  bg-gray-100 dark:bg-gray-800">
                  <p class="font-semibold text-xl p-2">Policy Holder Details</p>
                  <div id="customerForm" class="p-5 flex flex-col flex-wrap gap-5">
                    <div class="grid xl:grid-cols-2 xl:gap-6">
                      <div class="relative z-0 w-full mb-6 group">
                        <input

                          type="text"
                          name="givenName"
                          id="floating_first_name"
                          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                          placeholder=" "
                          bind:value={detailedClaim.customer.givenName}
                        />
                        <label
                          for="floating_first_name"
                          class="absolute text-sm text-purple-900 dark:text-gray-400 left-0 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                        >First name of Insured</label
                        >
                      </div>
                      <div class="relative z-0 w-full mb-6 group">
                        <input

                          type="text"
                          name="lastName"
                          id="floating_last_name"
                          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                          placeholder=" "
                          bind:value={detailedClaim.customer.lastName}
                        />
                        <label
                          for="floating_last_name"
                          class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                        >Last name of Insured</label
                        >
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 xl:gap-6">
                      <div class="relative z-0 w-full mb-6 group">
                        <input

                          type="tel"
                          name="phone"
                          id="floating_phone"
                          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                          placeholder=" "
                          bind:value={detailedClaim.customer.phone}
                        />
                        <label
                          for="floating_phone"
                          class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                        >Phone number</label
                        >
                      </div>
                      <div class="relative z-0 w-full mb-6 group">
                        <input

                          type="text"
                          name="dob"
                          id="floating_date"
                          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                          placeholder=" "
                          value={formatDate(detailedClaim.customer.dob)}
                        />
                        <label
                          for="floating_date"
                          class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                        >Date of Birth</label
                        >
                      </div>
                    </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <input

                        type="email"
                        name="emailAddress"
                        id="floating_email"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                        bind:value={detailedClaim.customer.email}
                      />
                      <label
                        for="floating_email"
                        class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Email address</label
                      >
                    </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <input

                        type="text"
                        name="address"
                        id="floating_address"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                        bind:value={detailedClaim.customer.address}
                      />
                      <label
                        for="floating_address"
                        class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Address</label
                      >
                    </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <!-- Readonly as won't be able to update this input -->
                      <input
                        type="text"
                        name="membershipId"
                        id="floating_memberID"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                        bind:value={detailedClaim.membershipId}

                      />
                      <label
                        for="floating_memberID"
                        class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Policy Number</label
                      >
                      <div class="relative z-0 my-10 w-full mb-6 group">
                        <select
                          name="lastRider"
                          bind:value={detailedClaim.customer.driverSelected}
                          id="floating_last_rider"
                          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"

                        >
                          <option value="" class="text-gray-600">Select</option>
                          <option value="1" class="text-gray-600">Yes</option>
                          <option value="0" class="text-gray-600">No</option>
                        </select>
                        <label
                          for="floating_last_rider"
                          class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                        >Was the policy holder the last person to use the vehicle?</label
                        >
                      </div>

                      {#if detailedClaim.customer.driverSelected === "0"}
                        <div class="grid xl:grid-cols-2 xl:gap-6">
                          <div class="relative z-0 w-full mb-6 group">
                            <input

                              type="text"
                              name="nonPolicyFirstName"
                              id="non_policy_first_name"
                              class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                              placeholder=" "
                              bind:value={nonPolicyFirstName}
                            />
                            <label
                              for="non_policy_first_name"
                              class="absolute text-sm text-purple-900 dark:text-gray-400 left-0 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                            >First name of Last Driver</label
                            >
                          </div>
                          <div class="relative z-0 w-full mb-6 group">
                            <input
                              type="text"
                              name="nonPolicyLastName"
                              id="non_policy_last_name"
                              class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                              placeholder=" "
                              bind:value={detailedClaim.customer.nonPolicyLastName}
                            />
                            <label
                              for="floating_last_name"
                              class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                            >Last name of Last Driver</label
                            >
                          </div>
                        </div>
                        <div class="grid xl:grid-cols-2 xl:gap-6">
                          <div class="relative z-0 w-full mb-6 group">
                            <input

                              type="tel"
                              name="nonPolicyPhone"
                              id="non_policy_phone"
                              class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                              placeholder=" "
                              bind:value={detailedClaim.customer.nonPolicyPhone}
                            />
                            <label
                              for="non_policy_phone"
                              class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                            >Phone number of Last Driver</label
                            >
                          </div>
                          <div class="relative z-0 w-full mb-6 group">
                            <input

                              type="text"
                              name="nonPolicyDoB"
                              id="nonPolicyDoB"
                              class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                              placeholder=" "
                              value={formatDate(detailedClaim.customer.nonPolicyDoB)}
                            />
                            <label
                              for="nonPolicyDoB"
                              class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                            >Date of Birth of Last Driver</label
                            >
                          </div>
                        </div>
                        <div class="relative z-0 my-10 w-full mb-6 group">
                          <select
                            name="driverRelation"
                            bind:value={relationSelected}
                            id="floating_relation"
                            class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                            readonly
                          >
                            <option value="" class="text-gray-600">Select</option>
                            <option value="1" class="text-gray-600">Husband</option>
                            <option value="2" class="text-gray-600">Wife</option>
                            <option value="3" class="text-gray-600">Son</option>
                            <option value="4" class="text-gray-600">Daughter</option>
                            <option value="5" class="text-gray-600">Other</option>
                          </select>
                          <label
                            for="floating_last_rider"
                            class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                          >What was the drivers relation to the policy holder?</label
                          >
                        </div>
                        {#if relationSelected === "5"}
                          <div class="relative z-0 w-full mb-6 group">
                            <input

                              type="text"
                              name="relationOtherDetails"
                              id="relation_other"
                              class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                              placeholder=" "
                              bind:value={detailedClaim.customer.nonPolicyRelationOther}
                            />
                            <label
                              for="relation_other"
                              class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                            >Description</label
                            >
                          </div>
                        {/if}


                        <div class="flex text-left flex-col space-y-3 p-2">

                          <Switch
                            design="inner"
                            value={detailedClaim.customerHistory.driverPermission}
                            label="Did the last driver have the policy holder's permission to use the vehicle?"
                          />
                          <Switch
                            design="inner"

                            value={detailedClaim.customerHistory.nonDriverHasInsurance}
                            label="Does the last driver have motor vehicle insurance?"
                          />
                        </div>

                      {/if}
                    </div>
                  </div>
                </div>
              </div>
              <div class="rounded-lg p-2 mr-2 mb-2 bg-gray-100 dark:bg-gray-800">
                <p class="font-semibold text-xl p-2">Vehicle details</p>
                <div id="vehicleForm" class="p-5 flex flex-col flex-wrap gap-5">
                  <div class="grid xl:grid-cols-2 xl:gap-6">
                    <div class="relative z-0 w-full mb-6 group">
                      <input

                        type="text"
                        name="vRego"
                        id="floating_registration"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                        bind:value={detailedClaim.vehicle.plate}
                      />
                      <label
                        for="floating_registration"
                        class="absolute text-sm text-purple-900 dark:text-gray-400 left-0 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Rego number</label
                      >
                    </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <input

                        type="text"
                        name="vEngine"
                        id="floating_engine"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                        bind:value={detailedClaim.vehicle.engineNumber}
                      />
                      <label
                        for="floating_engine"
                        class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Engine Type</label
                      >
                    </div>
                  </div>
                  <div class="grid xl:grid-cols-2 xl:gap-6">
                    <div class="relative z-0 w-full mb-6 group">
                      <input

                        type="text"
                        name="vMake"
                        id="floating_make"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                        bind:value={detailedClaim.vehicle.make_name}
                      />
                      <label
                        for="floating_make"
                        class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Vehicle Make</label
                      >
                    </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <input

                        type="text"
                        name="vYear"
                        id="floating_year"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                        bind:value={detailedClaim.vehicle.years}
                      />
                      <label
                        for="floating_year"
                        class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Vehicle Year</label
                      >
                    </div>
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input

                      type="text"
                      name="model"
                      id="floating_model"
                      class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                      placeholder=" "
                      bind:value={detailedClaim.vehicle.model_name}
                    />
                    <label
                      for="floating_model"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                    >Vehicle Model</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input

                      type="text"
                      name="VIN"
                      id="floating_vin"
                      class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                      placeholder=" "
                      bind:value={detailedClaim.vehicle.vehicleId}
                    />
                    <label
                      for="floating_vin"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                    >VIN</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input

                      type="text"
                      name="vGeneration"
                      id="floating_generation"
                      class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                      placeholder=" "
                      bind:value={detailedClaim.vehicle.generation_name}
                    />
                    <label
                      for="floating_generation"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                    >Vehicle Generation</label
                    >
                    <div class="relative z-0 my-10 w-full mb-6 group">
                      <div class="relative z-0 w-full mb-6 group">
                        <input

                          type="text"
                          name="color"
                          id="floating_color"
                          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                          placeholder=" "
                          bind:value={detailedClaim.vehicle.colour}
                        />
                        <label
                          for="floating_color"
                          class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                        >Vehicle Color</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="rounded-lg p-2 ml-2 mb-2  bg-gray-100 dark:bg-gray-800">
                  <p class="font-semibold text-xl p-2">Driver History</p>
                  <div class="flex flex-col space-y-3 p-2">
                    <p class="font-medium text-lg">In the past 5 years, has the driver:</p>
                    <Switch
                      design="inner"
                      value={detailedClaim.customerHistory.motorAccident}
                      label="Been involved in a motor vehicle accident?"
                    />
                    <Switch
                      design="inner"

                      value={detailedClaim.customerHistory.convictedOffence}
                      label="Been convicted of a driving offence?"
                    />
                    <Switch
                      design="inner"
                      value={detailedClaim.customerHistory.disqualified}

                      label="Been disqualified for driving or had their licence cancelled/suspended?"
                    />
                    <Switch
                      design="inner"

                      value={detailedClaim.customerHistory.refusedInsurance}
                      label="Been refused vehicle insurance or had their policy cancelled?"
                    />
                    <div class="grid xl:grid-cols-2 xl:gap-6">
                      <div class="relative z-0 w-full mb-6 my-5  group">
                        <input

                          type="number"
                          name="LicenceNumber"
                          id="licenseNumber"
                          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                          placeholder=" "
                          bind:value={detailedClaim.customerHistory.LicenceNumber}
                        />
                        <label
                          for="licenseNumber"
                          class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                        >Licence Number</label
                        >
                      </div>
                      <div class="relative z-0 w-full mb-6 my-5 group">
                        <input

                          type="date"
                          name="LicenceIssueDate"
                          id="licenseIssueDate"
                          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                          placeholder=" "
                          value={detailedClaim.customerHistory.LicenceIssueDate}
                        />
                        <label
                          for="floating_date"
                          class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                        >Licence issue date</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <!-- Vehicle Images -->
                  <div class="rounded-lg p-2 ml-2 mb-2  bg-gray-100 dark:bg-gray-800">
                    <p class="font-semibold text-xl p-2">Vehicle Images</p>
                    <div class="flex flex-col space-y-3 p-2">
                      <!-- send https with request -->
                      <img src={detailedImage.imageLink} alt="Vehicle Image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/await}
        </div>
      {:catch error}
        <div>{error.message}</div>
      {/await}
    </div>
  </div>
</main>
