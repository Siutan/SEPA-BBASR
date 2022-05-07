<script lang="ts">
	import { Form, Step } from 'svelte-multistep-form-local';
	import { Camera, CameraResultType } from '@capacitor/camera';
	import { HereProvider } from 'leaflet-geosearch'; // This doesn't work when building

	// Customer data Form
	// --------------------------------------------------
	// Address Lookup
	let address: string;
	let results: object = [];
	let debounceTimer: NodeJS.Timeout;

	const provider: HereProvider = new HereProvider({
		// https://community.algolia.com/places/api-clients.html#search-parameters
		params: {
			apiKey: 'uc52Fgb7mmXq_weQa5T3AWZIuqxcOLEcSILU_tR6T3g',
			countries: 'au',
			hitsPerPage: 5
		}
	});

	const debounce = async (e) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			if (e.target.value.length <= 3) {
				results = [];
			} else {
				getLocation();
			}
		}, 1000);
	};

	async function getLocation() {
		results = await provider.search({ query: address });
	}

	// DOB Formatting after focus loss
	const formatDOB = (e) => {
		let value = e.target.value;
		let day = value.slice(0, 2);
		let month = value.slice(2, 4);
		let year = value.slice(4, 8);
		if (value.length === 2) {
			// not sure if the first 2 if statements are necessary
			e.target.value = value + '-';
		} else if (value.length === 4) {
			e.target.value = day + '-' + month + '-';
		} else if (value.length === 8) {
			e.target.value = day + '-' + month + '-' + year; // formats date to dd/mm/yyyy
		}
	};

	// Phone number formatting
	const formatPhone = (e) => {
		let value = e.target.value;
		let area = value.slice(0, 2);
		let num1 = value.slice(2, 5);
		let num2 = value.slice(5, 8);
		let num3 = value.slice(8, 11);
		if (value.length === 11) {
			e.target.value = area + ' ' + num1 + '-' + num2 + '-' + num3; // formats the number into (xx) xxx-xxx-xxx
		}
	};

	// Multistep Form Data
	let multiStepOptions: object = {
		formTitle: 'Claims Form',
		formSubtitle: 'Please fill out the form below',
		stepsDescription: [
			{ title: 'Step 1', subtitle: 'Customer Information' },
			{ title: 'Step 2', subtitle: 'Upload Images' },
			{ title: 'Step 3', subtitle: 'Claim & Vehicle Information' },
			{ title: 'Step 4', subtitle: 'Review Information' }
		]
	};

	// Display Image Upload
	let imageUrl: string;
	const takePicture = async () => {
		const CImage = await Camera.getPhoto({
			quality: 100,
			allowEditing: false,
			resultType: CameraResultType.Uri
		});

		// image.webPath will contain a path that can be set as an image src.
		// You can access the original file using image.path, which can be
		// passed to the Filesystem API to read the raw data of the image,
		// if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
		imageUrl = CImage.webPath;
	};
</script>

<svelte:head>
	<title>Submit a claim</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
	<div class="container px-6 mx-auto grid">
		<h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Claims</h2>

		<div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
			<Form {multiStepOptions}>
				<Step>
					<!-- Customer Information -->
					<div class="w-32 flex flex-col gap-4 pl-4 px-4 pb-4 md:w-full lg:w-full">

					</div>
						<div id="customerForm" class="p-5 flex flex-col flex-wrap gap-5">
							<div  class="grid xl:grid-cols-2 xl:gap-6">
								<div  class="relative z-0 w-full mb-6 group">
									<input
										type="text"
										name="givenName"
										id="floating_first_name"
										class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
										placeholder=" "
									/>
									<label
										for="floating_first_name"
										class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
										>First name</label
									>
								</div>
								<div class="relative z-0 w-full mb-6 group">
									<input
										type="text"
										name="lastName"
										id="floating_last_name"
										class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
										placeholder=" "
									/>
									<label
										for="floating_last_name"
										class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
										>Last name</label
									>
								</div>
							</div>
							<div class="grid xl:grid-cols-2 xl:gap-6">
								<div class="relative z-0 w-full mb-6 group">
									<input
										type="tel"
										name="phone"
										id="floating_phone"
										on:focusout={formatPhone}
										class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
										placeholder=" "
									/>
									<label
										for="floating_phone"
										class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
										>Phone number (61 123-456-789)</label
									>
								</div>
								<div class="relative z-0 w-full mb-6 group">
									<input
										type="text"
										name="dob"
										id="floating_date"
										on:focusout={formatDOB}
										class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
										placeholder=" "
									/>
									<label
										for="floating_date"
										class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
										>Date of Birth (dd/mm/yyyy)</label
									>
								</div>
							</div>
							<div class="relative z-0 w-full mb-6 group">
								<input
									type="email"
									name="emailAddress"
									id="floating_email"
									class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
									placeholder=" "
								/>
								<label
									for="floating_email"
									class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
									>Email address</label
								>
							</div>
							<div class="relative z-0 w-full mb-6 group">
								<input
									type="text"
									bind:value={address}
									on:input={debounce}
									name="address"
									id="floating_address"
									class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
									placeholder=" "
								/>
								<label
									for="floating_address"
									class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
									>Address</label
								>
								<div class="text-sm">
									<ul>
										{#each results as { label }}
											<li
												on:click={() => {
													address = label;
													results = [];
												}}
												class="p-2 rounded-md cursor-pointer hover:bg-purple-700 dark:hover:bg-gray-900 hover:text-gray-100"
											>
												{label}
											</li>
										{/each}
									</ul>
								</div>
							</div>
							<div class="relative z-0 w-full mb-6 group">
								<input
									type="text"
									name="membershipId"
									id="floating_memberID"
									class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
									placeholder=" "
								/>
								<label
									for="floating_memberID"
									class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
									>Membership ID (??)</label
								>
							</div>
						</div>
				</Step>
				<Step>
					<!-- Upload Image -->
					<div
						class=" ml-10 flex flex-col flex-wrap items-center gap-5 h-full px-4 py-3 mb-8 bg-white self-center w-3/4 rounded-lg shadow-md dark:bg-gray-900 md:ml-0 lg:ml-0  "
					>
						<div class="w-32 flex flex-col gap-4 pl-4 px-4 pb-4 md:w-full lg:w-full">
							<div class="w-full">
								<img class="object-cover" draggable="false" src={imageUrl} alt="" />
							</div>
							<!-- buttons -->
							<div class="flex flex-row gap-2">
								<label
									class="w-3/4 flex flex-col items-center text-center px-4 py-6 bg-white text-gray-900 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer transition duration-500 hover:bg-gray-700 hover:text-white"
								>
									<svg
										class="w-8 h-8"
										fill="currentColor"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
									>
										<path
											d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"
										/>
									</svg>
									<span class="mt-2 text-base leading-normal hidden md:block lg:block "
										>Upload an image</span
									>
									<input on:click|preventDefault={takePicture} type="file" class="hidden" />
								</label>
								<label
									class=" flex flex-col items-center text-center md:px-4 lg:py-6 lg:px-4 lg:px-4 bg-white text-gray-900 rounded-lg shadow-lg md:tracking-wide lg:tracking-wide uppercase border cursor-pointer transition duration-500 hover:bg-gray-700 hover:text-white"
								>
									<span class="mt-2 text-sm leading-normal">Get Vehicle Data</span>
									<input class="hidden" />
								</label>
							</div>
						</div>
					</div>
				</Step>
				<Step>
					<!-- Vehicle Fields -->
					<div class="p-5 flex flex-col flex-wrap gap-5">
						<div class="flex flex-col w-fit">
							<label class="block text-gray-700 dark:text-gray-200 mb-2" for="rego">
								License Plate
							</label>
							<input
								class="w-7/12 px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
								type="text"
								name="rego"
								id="rego"
							/>
						</div>
						<div class="flex flex-col gap-5 md:flex-row lg:flex-row">
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="vMake">
									Vehicle Make
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="make"
									id="vMake"
								/>
							</div>
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="vModel">
									Vehicle Model
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="model"
									id="vModel"
								/>
							</div>
						</div>
						<div class="flex flex-col gap-5 md:flex-row lg:flex-row">
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="bodyType">
									Vehicle Body Type
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="bodyType"
									id="bodyType"
								/>
							</div>
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="yearOfMake">
									Year of Manufacture
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="yearOfMake"
									id="yearOfMake"
								/>
							</div>
						</div>
						<div class="flex flex-col gap-5 md:flex-row lg:flex-row">
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="vColor">
									Vehicle Colour
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="vColor"
									id="vColor"
								/>
							</div>
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="engineNumber">
									Engine Number/ID
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="engineNumber"
									id="engineNumber"
								/>
							</div>
						</div>
					</div>
				</Step>
				<Step />
			</Form>
		</div>
	</div>
</main>

<style>
	:root {
		--date-picker-background: #121317;
		--date-picker-foreground: #fff;
		--date-picker-highlight-border: none;
		--date-picker-highlight-shadow: #121317;
		--date-picker-selected-color: #fff;
		--date-picker-selected-background: #121317;
		--date-input-width: 250px;
	}
</style>
