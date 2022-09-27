<script>
  import { onMount } from "svelte";
  import Chartjs from "chart.js";



  let claims;
  let totalClaims;
  let completeClaim = 0;
  let pendingClaim = 0;
  let failedClaim = 0;

  async function getClaims() {
    await fetch("https://dairies-rest-api.herokuapp.com/claims", {
      method: "GET",
      credentials: "include",
      mode: "cors"
    })
      .then((response) => response.json())
      .then((data) => {
        claims = data;
        totalClaims = Object.keys(claims).length;
        claimProcess();
        console.log(getClaimsByMonth())
        claimChart()

      }).catch((error) => console.log(error));
  }


  function claimProcess() {
    for (let i = 0; i < totalClaims; i++) {
      if (claims[i].status == "success") {
        completeClaim = completeClaim + 1;
      } else if (claims[i].status == "pending") {
        pendingClaim = pendingClaim + 1;
      } else {
        failedClaim = failedClaim + 1;
      }

    }
    ;
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

  // find how many claims are made in a month
  let chartValues = [];
  let chartLabels = [];
  let ctx;
  let chartCanvas;
  let claimsByMonth = {};
  function getClaimsByMonth() {

    for (let i = 0; i < totalClaims; i++) {
      let date = formatDate(claims[i].createdAt);
      if (claimsByMonth[date]) {
        claimsByMonth[date] += 1;
      } else {
        claimsByMonth[date] = 1;
      }
    }

    for (let key in claimsByMonth) {
      chartValues.push(claimsByMonth[key]);
    }

    for (let key in claimsByMonth) {
      chartLabels.push(key);
    }

    console.log(chartLabels)
    return claimsByMonth;
  }

  function claimChart() {

    ctx = chartCanvas.getContext('2d');
    new Chartjs(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Claims',
          backgroundColor: 'rgb(127,60,242)',
          borderColor: 'rgb(216,194,255)',
          data: chartValues
        }]
      }
    });

  };


</script>

<svelte:head>

  <title>Dashboard</title>

</svelte:head>


<main class="h-full overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Dashboard</h2>
    <!-- CTA -->
    <div
      class="flex items-center justify-between p-2 mb-8 text-sm font-semibold text-purple-100 dark:bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple"
    >

      <div
        class="flex flex-col items-left w-full p-10 bg-gray-100 shadow-inner text-black dark:bg-gray-800 dark:text-gray-300 rounded-lg text-lg">
        <span class="text-gray-300">Welcome </span>
        <span class="text-purple-600">Here's the reports: </span>
        <span
        >There is <span class="text-orange-500">{pendingClaim} claims in process</span>, <span
          class="text-green-500">{completeClaim} completed claims</span>
						, and
						<span class="text-red-500">{failedClaim} failed.</span>
					</span>
        <span>The progress is looking <span class="text-green-500">great!</span>
					</span>
        <!-- plus sign -->
        <div
          class=" p-2 mt-12 w-56 align-middle border rounded-lg border-teal-400 hover:bg-teal-900 hover:text-gray-400 "
        >
          <a class="flex flex-row gap-5" href="/claims/createClaim">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              height="30"
              width="30"
              viewBox="0 0 52 52"
              fill="#16bdca"
              xml:space="preserve"
            >
								<path
                  d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M38.5,28H28v11c0,1.104-0.896,2-2,2
		s-2-0.896-2-2V28H13.5c-1.104,0-2-0.896-2-2s0.896-2,2-2H24V14c0-1.104,0.896-2,2-2s2,0.896,2,2v10h10.5c1.104,0,2,0.896,2,2
		S39.604,28,38.5,28z"
                />
							</svg>
            Create new claim
          </a>
        </div>
      </div>
    </div>
    <!-- Cards -->
    <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      <!-- Card -->
      <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
        <div
          class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
            />
          </svg>
        </div>
        <div>
          <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Total claims</p>
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{totalClaims}</p>
        </div>
      </div>
      <!-- Card -->
      <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
        <div
          class="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500"
        >
          <!-- success svg-->
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Completed claims</p>
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{completeClaim}</p>
        </div>
      </div>
      <!-- Card -->
      <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
        <div
          class="p-3 mr-4 text-red-500 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-500"
        >
          <!-- failed svg-->
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Failed claims</p>
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{failedClaim}</p>
        </div>
      </div>
      <!-- Card -->
      <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
        <div
          class="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500"
        >
          <!-- time svg-->
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Pending claims</p>
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{pendingClaim}</p>
        </div>
      </div>
    </div>

    <!-- New Table -->
    <div class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="">
        <table class="w-full whitespace-no-wrap">
          <thead>
          <tr
            class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
          >
            <th class="px-8 py-3">MembershipID</th>
            <th class="px-4 py-3">ClaimID</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Date</th>
          </tr>
          </thead>


          <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">


          {#await getClaims()}
            <p>Loading...</p>
          {:then data}

            {#each claims as claim (claim._id)}
              <tr class="text-gray-700 dark:text-gray-400">
                <td class="px-0 py-3">
                  <div class="flex items-center text-sm">
                    <!-- Avatar with inset shadow -->

                    <div>
                      <p class="font-semibold px-10">{claim.membershipId}</p>

                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm">{claim.claimID} </td>
                <td class="px-4 py-3 text-xs">

                  {#if claim.status === "success"}
										<span
                      class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
                    >
											{claim.status}

										</span>
                  {:else if (claim.status === "pending")}
									  <span
                      class="px-2 py-1 font-semibold leading-tight text-orange-700  bg-orange-400 rounded-full dark:bg-orange-700 dark:text-orange-100"
                    >
									  {claim.status}

								  </span>
                  {:else}
									  <span
                      class="px-2 py-1 font-semibold leading-tight text-red-700  bg-red-600 rounded-full dark:bg-red-700 dark:text-red-100"
                    >
									  {claim.status}

								  </span>
                  {/if}


                </td>
                <td class="px-4 py-3 text-sm"> {formatDate(claim.createdAt)} </td>
              </tr>
            {/each}

          {:catch error}
            <div>{error.message}</div>
          {/await}

          </tbody>
        </table>
      </div>

    </div>

    <!-- Charts -->
    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Charts</h2>
    <div class="grid gap-6 mb-8 md:grid-cols-2">
      <div class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800" id="chart-container">

        <canvas bind:this={chartCanvas} id="monthlyClaims"></canvas>

      </div>


      <div class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">

        <canvas id="line" />

      </div>

    </div>
  </div>

</main>