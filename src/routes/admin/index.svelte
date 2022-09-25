<script>
import {onMount} from "svelte"

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
        console.log(data);
        claims = data;
		totalClaims = Object.keys(claims).length;
		claimProcess();
      });
  }
  function claimProcess(){
	for (let i = 0; i < totalClaims; i++){
		console.log(claims[i].status)
		if(claims[i].status=="success"){
			completeClaim = completeClaim+1;
		}
		else if(claims[i].status=="pending")
		{
			pendingClaim = pendingClaim+1;
		}
		else 
		{
			failedClaim = failedClaim+1;
		}
	};

  }

  onMount(async () => {
		getClaims()
	});


</script>
<svelte:head>

	<title>Dashboard</title>
</svelte:head>

<!-- {#await getClaims()}
..loading
{:then data}
  {#each claims as claim}
  <p>{claim.status}</p>
  {/each}

{/await}  -->

<main class="h-full overflow-y-auto">
	<div class="container px-6 mx-auto grid">
		<h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Dashboard</h2>
		<!-- CTA -->
		<div
			class="flex items-center justify-between p-2 mb-8 text-sm font-semibold text-purple-100 dark:bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple"
		>

			<div class="flex flex-col items-left w-full p-10 bg-gray-100 shadow-inner text-black dark:bg-gray-800 dark:text-gray-300 rounded-lg text-lg">
				<span class="text-gray-300">Welcome </span>
				<span class="text-purple-600">Here's the reports: </span>
				<span
					>There is <span class="text-orange-500">{pendingClaim} claims in process</span>, <span class="text-green-500">{completeClaim} completed claims</span> 
					, and
					<span class="text-red-500">{failedClaim} failed.</span>
				</span>
					<span>The progress is looks <span class="text-green-500">great!</span>
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
			<div class="w-full overflow-x-auto">
				<table class="w-full whitespace-no-wrap">
					<thead>
						<tr
							class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
						>
							<th class="px-4 py-3">Client</th>
							<th class="px-4 py-3">Amount</th>
							<th class="px-4 py-3">Status</th>
							<th class="px-4 py-3">Date</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
						<tr class="text-gray-700 dark:text-gray-400">
							<td class="px-4 py-3">
								<div class="flex items-center text-sm">
									<!-- Avatar with inset shadow -->
									<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
										<img
											class="object-cover w-full h-full rounded-full"
											src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
											alt=""
											loading="lazy"
										/>
										<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
									</div>
									<div>
										<p class="font-semibold">Hans Burger</p>
										<p class="text-xs text-gray-600 dark:text-gray-400">10x Developer</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 text-sm"> $ 863.45 </td>
							<td class="px-4 py-3 text-xs">
								<span
									class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
								>
									Successful
								</span>
							</td>
							<td class="px-4 py-3 text-sm"> 6/10/2020 </td>
						</tr>

						<tr class="text-gray-700 dark:text-gray-400">
							<td class="px-4 py-3">
								<div class="flex items-center text-sm">
									<!-- Avatar with inset shadow -->
									<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
										<img
											class="object-cover w-full h-full rounded-full"
											src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&facepad=3&fit=facearea&s=707b9c33066bf8808c934c8ab394dff6"
											alt=""
											loading="lazy"
										/>
										<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
									</div>
									<div>
										<p class="font-semibold">Jolina Angelie</p>
										<p class="text-xs text-gray-600 dark:text-gray-400">Unemployed</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 text-sm"> $ 369.95 </td>
							<td class="px-4 py-3 text-xs">
								<span
									class="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600"
								>
									Pending
								</span>
							</td>
							<td class="px-4 py-3 text-sm"> 6/10/2020 </td>
						</tr>

						<tr class="text-gray-700 dark:text-gray-400">
							<td class="px-4 py-3">
								<div class="flex items-center text-sm">
									<!-- Avatar with inset shadow -->
									<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
										<img
											class="object-cover w-full h-full rounded-full"
											src="https://images.unsplash.com/photo-1551069613-1904dbdcda11?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
											alt=""
											loading="lazy"
										/>
										<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
									</div>
									<div>
										<p class="font-semibold">Sarah Curry</p>
										<p class="text-xs text-gray-600 dark:text-gray-400">Designer</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 text-sm"> $ 86.00 </td>
							<td class="px-4 py-3 text-xs">
								<span
									class="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700"
								>
									Failed
								</span>
							</td>
							<td class="px-4 py-3 text-sm"> 6/10/2020 </td>
						</tr>

						<tr class="text-gray-700 dark:text-gray-400">
							<td class="px-4 py-3">
								<div class="flex items-center text-sm">
									<!-- Avatar with inset shadow -->
									<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
										<img
											class="object-cover w-full h-full rounded-full"
											src="https://images.unsplash.com/photo-1551006917-3b4c078c47c9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
											alt=""
											loading="lazy"
										/>
										<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
									</div>
									<div>
										<p class="font-semibold">Rulia Joberts</p>
										<p class="text-xs text-gray-600 dark:text-gray-400">Actress</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 text-sm"> $ 1276.45 </td>
							<td class="px-4 py-3 text-xs">
								<span
									class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
								>
									Successful
								</span>
							</td>
							<td class="px-4 py-3 text-sm"> 6/10/2020 </td>
						</tr>

						<tr class="text-gray-700 dark:text-gray-400">
							<td class="px-4 py-3">
								<div class="flex items-center text-sm">
									<!-- Avatar with inset shadow -->
									<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
										<img
											class="object-cover w-full h-full rounded-full"
											src="https://images.unsplash.com/photo-1546456073-6712f79251bb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
											alt=""
											loading="lazy"
										/>
										<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
									</div>
									<div>
										<p class="font-semibold">Wenzel Dashington</p>
										<p class="text-xs text-gray-600 dark:text-gray-400">Actor</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 text-sm"> $ 863.45 </td>
							<td class="px-4 py-3 text-xs">
								<span
									class="px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700"
								>
									Expired
								</span>
							</td>
							<td class="px-4 py-3 text-sm"> 6/10/2020 </td>
						</tr>

						<tr class="text-gray-700 dark:text-gray-400">
							<td class="px-4 py-3">
								<div class="flex items-center text-sm">
									<!-- Avatar with inset shadow -->
									<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
										<img
											class="object-cover w-full h-full rounded-full"
											src="https://images.unsplash.com/photo-1502720705749-871143f0e671?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=b8377ca9f985d80264279f277f3a67f5"
											alt=""
											loading="lazy"
										/>
										<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
									</div>
									<div>
										<p class="font-semibold">Dave Li</p>
										<p class="text-xs text-gray-600 dark:text-gray-400">Influencer</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 text-sm"> $ 863.45 </td>
							<td class="px-4 py-3 text-xs">
								<span
									class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
								>
									Successful
								</span>
							</td>
							<td class="px-4 py-3 text-sm"> 6/10/2020 </td>
						</tr>

						<tr class="text-gray-700 dark:text-gray-400">
							<td class="px-4 py-3">
								<div class="flex items-center text-sm">
									<!-- Avatar with inset shadow -->
									<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
										<img
											class="object-cover w-full h-full rounded-full"
											src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
											alt=""
											loading="lazy"
										/>
										<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
									</div>
									<div>
										<p class="font-semibold">Maria Ramovic</p>
										<p class="text-xs text-gray-600 dark:text-gray-400">Runner</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 text-sm"> $ 863.45 </td>
							<td class="px-4 py-3 text-xs">
								<span
									class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
								>
									Successful
								</span>
							</td>
							<td class="px-4 py-3 text-sm"> 6/10/2020 </td>
						</tr>

						<tr class="text-gray-700 dark:text-gray-400">
							<td class="px-4 py-3">
								<div class="flex items-center text-sm">
									<!-- Avatar with inset shadow -->
									<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
										<img
											class="object-cover w-full h-full rounded-full"
											src="https://images.unsplash.com/photo-1566411520896-01e7ca4726af?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
											alt=""
											loading="lazy"
										/>
										<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
									</div>
									<div>
										<p class="font-semibold">Hitney Wouston</p>
										<p class="text-xs text-gray-600 dark:text-gray-400">Singer</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 text-sm"> $ 863.45 </td>
							<td class="px-4 py-3 text-xs">
								<span
									class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
								>
									Successful
								</span>
							</td>
							<td class="px-4 py-3 text-sm"> 6/10/2020 </td>
						</tr>

						<tr class="text-gray-700 dark:text-gray-400">
							<td class="px-4 py-3">
								<div class="flex items-center text-sm">
									<!-- Avatar with inset shadow -->
									<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
										<img
											class="object-cover w-full h-full rounded-full"
											src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
											alt=""
											loading="lazy"
										/>
										<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
									</div>
									<div>
										<p class="font-semibold">Hans Burger</p>
										<p class="text-xs text-gray-600 dark:text-gray-400">10x Developer</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 text-sm"> $ 863.45 </td>
							<td class="px-4 py-3 text-xs">
								<span
									class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
								>
									Successful
								</span>
							</td>
							<td class="px-4 py-3 text-sm"> 6/10/2020 </td>
						</tr>
					</tbody>
				</table>
			</div>
			<div
				class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"
			>
				<span class="flex items-center col-span-3"> Showing 21-30 of 100 </span>
				<span class="col-span-2" />
				<!-- Pagination -->
				<span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
					<nav aria-label="Table navigation">
						<ul class="inline-flex items-center">
							<li>
								<button
									class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
									aria-label="Previous"
								>
									<svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
										<path
											d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
											clip-rule="evenodd"
											fill-rule="evenodd"
										/>
									</svg>
								</button>
							</li>
							<li>
								<button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
									1
								</button>
							</li>
							<li>
								<button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
									2
								</button>
							</li>
							<li>
								<button
									class="px-3 py-1 text-white transition-colors duration-150 bg-purple-600 border border-r-0 border-purple-600 rounded-md focus:outline-none focus:shadow-outline-purple"
								>
									3
								</button>
							</li>
							<li>
								<button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
									4
								</button>
							</li>
							<li>
								<span class="px-3 py-1">...</span>
							</li>
							<li>
								<button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
									8
								</button>
							</li>
							<li>
								<button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
									9
								</button>
							</li>
							<li>
								<button
									class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
									aria-label="Next"
								>
									<svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
										<path
											d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
											clip-rule="evenodd"
											fill-rule="evenodd"
										/>
									</svg>
								</button>
							</li>
						</ul>
					</nav>
				</span>
			</div>
		</div>

		<!-- Charts -->
		<h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Charts</h2>
		<div class="grid gap-6 mb-8 md:grid-cols-2">
			<div class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
				<h4 class="mb-4 font-semibold text-gray-800 dark:text-gray-300">Revenue</h4>
				<canvas id="pie" />
				<div class="flex justify-center mt-4 space-x-3 text-sm text-gray-600 dark:text-gray-400">
					<!-- Chart legend -->
					<div class="flex items-center">
						<span class="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full" />
						<span>Shirts</span>
					</div>
					<div class="flex items-center">
						<span class="inline-block w-3 h-3 mr-1 bg-teal-600 rounded-full" />
						<span>Shoes</span>
					</div>
					<div class="flex items-center">
						<span class="inline-block w-3 h-3 mr-1 bg-purple-600 rounded-full" />
						<span>Bags</span>
					</div>
				</div>
			</div>
			<div class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
				<h4 class="mb-4 font-semibold text-gray-800 dark:text-gray-300">Traffic</h4>
				<canvas id="line" />
				<div class="flex justify-center mt-4 space-x-3 text-sm text-gray-600 dark:text-gray-400">
					<!-- Chart legend -->
					<div class="flex items-center">
						<span class="inline-block w-3 h-3 mr-1 bg-teal-600 rounded-full" />
						<span>Organic</span>
					</div>
					<div class="flex items-center">
						<span class="inline-block w-3 h-3 mr-1 bg-purple-600 rounded-full" />
						<span>Paid</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	
</main>