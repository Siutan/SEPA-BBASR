<script>
	import { Form, Step } from 'svelte-multistep-form-local';
	import { Camera, CameraResultType } from '@capacitor/camera';

	let multiStepOptions = {
		formTitle: 'Claims Form',
		formSubtitle: 'Please fill out the form below',
		stepsDescription: [
			{ title: 'Step 1', subtitle: 'Customer Information' },
			{ title: 'Step 2', subtitle: 'Upload Images' },
			{ title: 'Step 3', subtitle: 'Claim & Vehicle Information' },
			{ title: 'Step 4', subtitle: 'Review Information' }
		]
	};

	let imageUrl;
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
					<div class="p-5 flex flex-col flex-wrap gap-5">
						<div class="flex flex-col gap-5 md:flex-row lg:flex-row">
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="firstName">
									First Name
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="firstName"
									id="firstName"
								/>
							</div>
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="lastName">
									Last Name
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="lastName"
									id="lastName"
								/>
							</div>
						</div>
						<div class="flex flex-col gap-5 md:flex-row lg:flex-row">
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="phone">
									Phone Number
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="phone"
									id="phone"
								/>
							</div>
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="dob">
									Date of Birth
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="dateOfBirth"
									id="dob"
								/>
							</div>
						</div>
						<div class="flex flex-col gap-5 md:flex-row lg:flex-row">
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="address">
									Home Address
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="text"
									name="address"
									id="address"
								/>
							</div>
							<div class="flex flex-col">
								<label class="block text-gray-700 dark:text-gray-200 mb-2" for="email">
									Email
								</label>
								<input
									class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
									type="email"
									name="email"
									id="email"
								/>
							</div>
						</div>
						<div class="flex flex-col">
							<label class="block text-gray-700 dark:text-gray-200 mb-2" for="email">
								Membership ID
							</label>
							<input
								class="w-7/12 px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-900 rounded-lg focus:outline-none focus:border-gray-500"
								type="text"
								name="MembershipID"
								id="MembershipID"
							/>
						</div>
					</div>
				</Step>
				<Step>
					<!-- Upload Image -->
					<div
						class=" ml-10 flex flex-col flex-wrap items-center gap-5 h-full px-4 py-3 mb-8 bg-white self-center w-3/4 rounded-lg shadow-md dark:bg-gray-900 md:ml-0 lg:ml-0  "
					>
						<div class="w-32 flex flex-col gap-4 pl-4 px-4 md:w-full lg:w-full">
							<div class="w-full">
								<img class="object-cover" src={imageUrl} alt="" />
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
