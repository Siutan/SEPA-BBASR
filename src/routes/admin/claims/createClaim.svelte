<script lang="ts">
  import Switch from "../../../lib/components/Switch.svelte";

  import { Form, Step } from "svelte-multistep-form-local";
  import { Camera, CameraResultType } from "@capacitor/camera";
  import axios from "axios";
  import FormData from "form-data";

  // Customer data Form
  // --------------------------------------------------
  // Address Lookup
  let address: string;
  let results: object = [];
  let debounceTimer: NodeJS.Timeout;

  // vehicle data Form
  // --------------------------------------------------
  let vehicle_make: string;
  let vehicle_model: string;
  let vehicle_year: string;
  let vehicle_generation: string;


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
    // url = https://api.geoapify.com/v1/geocode/autocomplete?text=LOCATIONGOESHERE&filter=countrycode:au&apiKey=dc17356b57e24d99aad8a6d3f195dedc
    let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${address}&filter=countrycode:au&apiKey=dc17356b57e24d99aad8a6d3f195dedc`;
    let response = await axios.get(url);
    let resData = response.data.features;
    // loop through the results and get the formatted address
    for (let i = 0; i < resData.length; i++) {
      let formattedData = {
        label: resData[i].properties.formatted
      };
      results.push(formattedData);
    }
    console.log(results);
  }

  // Phone number formatting
  const formatPhone = (e) => {
    let value = e.target.value;
    let area = value.slice(0, 2);
    let num1 = value.slice(2, 5);
    let num2 = value.slice(5, 8);
    let num3 = value.slice(8, 11);
    if (value.length === 11) {
      e.target.value = area + " " + num1 + "-" + num2 + "-" + num3; // formats the number into (xx) xxx-xxx-xxx
    }
  };

  // Multistep Form Data
  let multiStepOptions: object = {
    formTitle: "Claims Form",
    formSubtitle: "Please fill out the form below",
    stepsDescription: [
      { title: "Step 1", subtitle: "Customer Information" },
      { title: "Step 2", subtitle: "Upload Images" },
      { title: "Step 3", subtitle: "Driver History" },
      { title: "Step 4", subtitle: "Claim & Vehicle Information" },
      { title: "Step 5", subtitle: "Review Information" }
    ]
  };

  // Display Image Upload
  let imageUrl: string;
  let setImage: string | ArrayBuffer;
  let imageTest: string;
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
    console.log(CImage.path);

    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          let base64data = reader.result;
          console.log(base64data);
          setImage = base64data;
        };
      });
  };


  function getClaim(e) {
    e.preventDefault();

    let data = new FormData();
    let vehicleImage = document.querySelector("#imageInput");
    data.append("image", vehicleImage.files[0]);
    let config = {
      method: "post",
      url: "https://dairies-rest-api.herokuapp.com/claims/autogen/",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: data
    };
    axios(config)
      .then((response) => {
        console.log(response);
        localStorage.setItem("vehicle", JSON.stringify(response.data));
        // fill out the form with the data
        let vehicleData = JSON.parse(localStorage.getItem("vehicle"));
        vehicle_make = vehicleData.mode_info.make_name;
        vehicle_model = vehicleData.mode_info.model_name;
        vehicle_year = vehicleData.mode_info.years;
        vehicle_generation = vehicleData.mode_info.generation_name;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // handle submit
  function handleSubmit(e) {
    e.preventDefault();
    //prepare data
    let cData = JSON.parse(localStorage.getItem("customer"));
    let vData = JSON.parse(localStorage.getItem("vehicle"));
    let dData = JSON.parse(localStorage.getItem("driver"));

    let fileInput = document.querySelector("#imageInput") as HTMLInputElement;

    let formData = new FormData();
    formData.append("recordId", "00073");
    formData.append("membershipId", cData["membershipId"]);
    formData.append("image", fileInput.files[0]);
    formData.append("rego", "reg321");
    formData.append("make", vData["Make"]);
    formData.append("model", vData["Model"]);
    formData.append("bodyType", vData["Body"]);
    formData.append("yearOfMake", "string");
    formData.append("colour", "Red");
    formData.append("engineNumber", "12345");

    // send data to server
    fetch("https://dairies-rest-api.herokuapp.com/claims", {
      method: "POST",
      body: formData

    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Success:", json);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // clear local storage
    localStorage.clear();
    // redirect to success page or display a final form step with a success message
    window.location.href = "/";
  }


  let driverOptions = [
    { id: 1, text: `Yes` },
    { id: 2, text: `No` }
  ];

  let driverSelected;

  let relation = [
    { id: 1, text: `Husband` },
    { id: 2, text: `Wife` },
    { id: 3, text: `Son` },
    { id: 4, text: `Daughter` },
    { id: 5, text: `Other` }
  ];
  let relationSelected;

  let driverPermission;
  let nonDriverHasInsurance;

  let motorAccident;
  let convictedOfOffence;
  let disqualified;
  let refusedInsurance;


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
          <div id="customerForm" class="p-5 flex flex-col flex-wrap gap-5">
            <div class="grid xl:grid-cols-2 xl:gap-6">
              <div class="relative z-0 w-full mb-6 group">
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
                >First name of Insured</label
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
                  on:focusout={formatPhone}
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                />
                <label
                  for="floating_phone"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Phone number (614-00-000-000)</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="dob"
                  id="floating_date"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                />
                <label
                  for="floating_date"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Date of Birth (yyyy/mm/dd)</label
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
              >Policy Number (XX000000)</label
              >
              <div class="relative z-0 my-10 w-full mb-6 group">
                <select
                  name="lastRider"
                  id="floating_last_rider"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  bind:value={driverSelected}
                >
                  <option disabled value="" class="text-gray-600">Select</option>
                  {#each driverOptions as option}
                    <option class="text-black" value={option}>
                      {option.text}
                    </option>
                  {/each}
                </select>
                <label
                  for="floating_last_rider"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Was the policy holder the last person to use the vehicle?</label
                >
              </div>
              {#if driverSelected}
                {#if driverSelected.id === 2}
                  <div>
                    <div class="grid xl:grid-cols-2 xl:gap-6">
                      <div class="relative z-0 w-full mb-6 group">
                        <input
                          type="text"
                          name="nonPolicyFirstName"
                          id="non_policy_first_name"
                          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                          placeholder=" "
                        />
                        <label
                          for="non_policy_first_name"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >First name of Last Driver</label
                        >
                      </div>
                      <div class="relative z-0 w-full mb-6 group">
                        <input
                          type="text"
                          name="nonPolicyLastName"
                          id="non_policy_last_name"
                          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                          placeholder=" "
                        />
                        <label
                          for="non_policy_last_name"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
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
                          on:focusout={formatPhone}
                          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                          placeholder=" "
                        />
                        <label
                          for="non_policy_phone"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Phone number of Last Driver</label
                        >
                      </div>
                      <div class="relative z-0 w-full mb-6 group">
                        <input
                          type="text"
                          name="nonPolicyDoB"
                          id="non_policy_date"
                          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                          placeholder=" "
                        />
                        <label
                          for="non_policy_date"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Date of Birth of Last Driver</label
                        >
                      </div>
                    </div>
                    <div class="relative z-0 my-10 w-full mb-6 group">
                      <select
                        name="driverRelation"
                        id="floating_relation"
                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                        bind:value={relationSelected}
                      >
                        <option disabled value="" class="text-gray-600">Select</option>
                        {#each relation as option}
                          <option class="text-black" value={option}>
                            {option.text}
                          </option>
                        {/each}
                      </select>
                      <label
                        for="floating_relation"
                        class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >What was the drivers relation to the policy holder?</label
                      >
                      {#if relationSelected}
                        {#if relationSelected.id === 5}
                          <div class="relative mt-5 z-0 w-full mb-6 group">
                            <input
                              type="text"
                              name="relationOtherDetails"
                              id="relation_other"
                              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                              placeholder=" "
                            />
                            <label
                              for="relation_other"
                              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >Details</label
                            >
                          </div>
                        {/if}
                      {/if}
                    </div>
                    <div class="my-4">
                      <div
                        class="text-lg text-gray-500 dark:text-gray-400"
                      >Did the last driver have the policy holder's permission to use the vehicle?
                      </div
                      >
                      <label class="pl-1 pr-4">
                        <input type="radio" bind:group={driverPermission} name="driverPermission" value={1}>
                        Yes
                      </label>
                      <label class="px-4">
                        <input type="radio" bind:group={driverPermission} name="driverPermission" value={2}>
                        No
                      </label>
                    </div>
                    <div class="my-4">
                      <div
                        class="text-lg text-gray-500 dark:text-gray-400"
                      >Does the last driver have motor vehicle insurance?
                      </div
                      >
                      <label class="pl-1 pr-4">
                        <input type="radio" bind:group={nonDriverHasInsurance} name="nonDriverHasInsurance" value={1}>
                        Yes
                      </label>
                      <label class="px-4">
                        <input type="radio" bind:group={nonDriverHasInsurance} name="nonDriverHasInsurance" value={2}>
                        No
                      </label>
                    </div>


                  </div>
                {/if}
              {/if}
            </div>
          </div>
        </Step>
        <Step>
          <!-- Upload Image -->
          <div
            id="imageForm"
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
                  <!--									on:click|preventDefault={takePicture}-->
                  <input id="imageInput" type="file" class="hidden" />
                </label>
                <label
                  class=" flex flex-col items-center text-center md:px-4 lg:py-6 lg:px-4 lg:px-4 bg-white text-gray-900 rounded-lg shadow-lg md:tracking-wide lg:tracking-wide uppercase border cursor-pointer transition duration-500 hover:bg-gray-700 hover:text-white"
                >
                  <span class="mt-2 text-sm leading-normal">Get Vehicle Data</span>
                  <input on:click={getClaim} class="hidden" />
                </label>
              </div>
            </div>
          </div>
        </Step>
        <Step>
          <div
            id="historyForm"
            class="p-5 flex flex-col flex-wrap gap-5"
          >
            <div
              class="flex flex-col gap-4 pb-4 md:w-full lg:w-full"
            >
              <p class="font-semibold text-xl">In the past 5 years, has the driver/last rider ever:</p>
              <Switch name="motorAccident" bind:value={motorAccident}
                      label="Been involved in a motor accident/incident?" design="inner" />
              <Switch name="convictedOffence" bind:value={convictedOfOffence}
                      label="Been issued/convicted of a driving offence?" design="inner" />
              <Switch name="disqualified" bind:value={disqualified}
                      label="Been disqualified from driving or had their licence cancelled or suspended?"
                      design="inner" />
              <Switch name="refusedInsurance" bind:value={refusedInsurance}
                      label="Been refused vehicle insurance or had their policy cancelled?" design="inner" />

              <!-- Very badly done, please redo this later -->
              <div class="hidden">
                <input
                  type="text"
                  name="motorAccident"
                  value={motorAccident}
                />
                <input
                  type="text"
                  name="convictedOffence"
                  value={convictedOfOffence}
                />
                <input
                  type="text"
                  name="disqualified"
                  value={disqualified}
                />
                <input
                  type="text"
                  name="refusedInsurance"
                  value={refusedInsurance}
                />
              </div>
            </div>
            <div class="grid xl:grid-cols-2 xl:gap-6">

              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="number"
                  name="LicenceNumber"
                  id="licenseNumber"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                />
                <label
                  for="licenseNumber"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Licence Number</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="LicenceIssueDate"
                  id="licenseIssueDate"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                />
                <label
                  for="licenseIssueDate"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Licence issue date (yyyy/mm/dd)</label
                >
              </div>
            </div>
          </div>
        </Step>
        <Step>
          <!-- Vehicle Fields -->
          <div id="vehicleForm" class="p-5 flex flex-col flex-wrap gap-5">
            <div class="grid xl:grid-cols-2 xl:gap-6">
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="make"
                  id="floating_vehicleMake"
                  class=" vehicle block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  bind:value={vehicle_make}
                />
                <label
                  for="floating_vehicleMake"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle Make</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="model"
                  id="vehicleModel"
                  class="vehicle block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  bind:value={vehicle_model}
                />
                <label
                  for="vehicleModel"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle Model</label
                >
              </div>
            </div>
            <div class="grid xl:grid-cols-2 xl:gap-6">
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="year"
                  id="floating_vehicle_year"
                  class="vehicle block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  bind:value={vehicle_year}
                />
                <label
                  for="floating_vehicle_year"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle Year of Make (range)</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="generation"
                  id="floating_vehicle_generation"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  bind:value={vehicle_generation}
                />
                <label
                  for="floating_vehicle_generation"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle Generation</label
                >
              </div>
            </div>
            <div class="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="engine"
                id="floating_engine"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                placeholder=" "
              />
              <label
                for="floating_engine"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >Vehicle Engine Type</label
              >
            </div>
            <div class="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="vehicleId"
                id="floating_vehicleId"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                placeholder=" "
              />
              <label
                for="floating_vehicleId"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >Vehicle ID</label
              >
            </div>
          </div>
        </Step>
        <Step>
          <div id="reviewForm" class="p-5 flex flex-col flex-wrap gap-5">
            <p>Please Review your Form Before Submitting, Once the form is Submitted, It <span class="text-red-600">CANNOT</span>
              be deleted.</p>
          </div>
          <button
            on:click={handleSubmit}
            class=" mx-5 px-5 py-3 font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Submit
          </button>
        </Step>
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
