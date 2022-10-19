<script lang="ts">
  import Switch from "../../../lib/components/Switch.svelte";
  import { Form, Step } from "svelte-multistep-form-local";
  import { Camera, CameraResultType } from "@capacitor/camera";
  import axios from "axios";
  import form from "form-data";
	import Search from "$src/lib/components/search/search.svelte";

    // Customer data Form
  // --------------------------------------------------
  let firstName: string;
  let lastName: string;
  let phone: string;
  let dob: string;
  let email: string;
  // Address Lookup
  let address: string;
  let results: object = [];
  let debounceTimer: number;

  // Non Policy Customer data Form
  // --------------------------------------------------
  let nonPolicyFirstName: string;
  let nonPolicyLastName: string;
  let nonPolicyPhone: string;
  let nonPolicyDoB: string;


  // vehicle data Form
  // --------------------------------------------------

  // vehicle data Form
  // --------------------------------------------------
  let vehicle_make: string;
  let vehicle_model: string;
  let vehicle_year: string;
  let vehicle_generation: string;
  let vehicle_license_plate:string;
  let vehicle_vin:string;
  let vehicle_transmission:string;
  let vehicle_colour:string;

  // Form Data
  // --------------------------------------------------
  let sumbitButtonText: string = "Submit";

  //function to get the current date in 'yyyy-mm-dd' string format 
  let format_max_date = () => {
    let timeElapsed = Date.now();
    let today = new Date(timeElapsed);
    console.log("today: ", today);
    let year = today.getFullYear();
    
    let month = today.getMonth().toString();
     if(month.length === 1){
      month = `0${month}`;
    }
    
    let day = today.getDate().toString();
       if(day.length === 1){
      day = `0${day}`;
    }
    let today_string = `${year}-${month}-${day}`;
    return today_string;
  }
  //for date inputs 
  let max_date = format_max_date();

  
  //Search Customer Data
  // --------------------------------------------------
  let searchButtonText = "Search";
  let customerSearched = false;
  let policyNumber;
  let policyNumberError = "";
  //search if policy number exists, return data to fields if it does
  const searchPolicyNumber = () => {
    console.log("policyNumber: ", policyNumber);

    //clear membershipIDerror
    policyNumberError = "";

    //validate policyID input before searching if exists
    let regexPolicyNumber = /^[A-Z]{2}\d{6}$/
    if(policyNumber){
  
      if(policyNumber.match(regexPolicyNumber))
      {
        console.log("valid policy number format");
        //search for policy number
        fetchCustomerData();

      }
      else{
        console.log("Not valid policy number format");
        policyNumberError = "Please type in a policy number in the format 'XX000000'";
      }
    }
    else{
      policyNumberError = "Please type in a policy number"
    }
  }

  //Search if CustomerID exists
  function fetchCustomerData() {
    searchButtonText = "Searching ..."
    let customerGetUrl =
      `https://dairies-rest-api.herokuapp.com/customers/${policyNumber}`;

    // check if member id exists
    fetch(customerGetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        // check if the request fails by checking the response for a message
        if ("message" in data) {
          policyNumberError = "Could not find policy number, please fill out details below";
          
          //After search complete show rest of form and revert button text to Search
          searchButtonText = "Search";
          customerSearched = true;

          //populate data
          firstName = "";
          lastName = ""; 
          phone = "";
          dob = "";
          email = "";
          address = "";

        } else {
          console.log("Customer exists");
          console.log(data);
          
          //populate data
          firstName = data.givenName;
          lastName = data.lastName; 
          phone = data.phone;
          dob = data.dob.slice(0,10);
          email = data.emailAddress;
          address = data.address;

          //After search complete show rest of form and revert button text to Search
          searchButtonText = "Search";
          customerSearched = true;
            
        }
      })
      .catch((error) => {
        console.log(`Error searching for customer ${error}`);
        policyNumberError = "Error searching for customer, please fill out details below";
        
        //After search complete show rest of form and revert button text to Search
        searchButtonText = "Search";
        customerSearched = true;
      });
  }



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
      { title: "Step 2", subtitle: "Driver History" },
      { title: "Step 3", subtitle: "Claim & Vehicle Information" },
      { title: "Step 4", subtitle: "Review Information" }
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

  let imageRecButtonText = "Run Image Recognition";
  let imageRecError = "";

  function getClaim(e) {
    e.preventDefault();
    
    imageRecButtonText = "Processing...";
    imageRecError = ""; //clear any errors

    let data = new FormData();
    let vehicleImage = document.querySelector("#imageInput");
    console.log(`vehicleImage: ${vehicleImage}`)
    data.append("image", vehicleImage.files[0]);
    let config = {
      method: "post",
      url: "https://dairies-rest-api.herokuapp.com/claims/autogen",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      mode: "cors",
      withCredentials: true,
      data: data
    };
    axios(config)
      .then((response) => {
        console.log(response);
        localStorage.setItem("vehicle", JSON.stringify(response.data));
        
        //Check if Error
        if(response.data.message)
        {
          
          imageRecError = "Unable to run image recognition, please type details below";
          //clear input fields         
          vehicle_make = "";
          vehicle_model = "";
          vehicle_year = "";
          vehicle_generation = "";
          vehicle_license_plate = "";
          vehicle_colour = "";
          
          imageRecButtonText = "Run Image Recognition";
        }
        else{

          //TODO: Change this to run off data from response not the LocalStorage object
          // fill out the form with the data
          let vehicleData = JSON.parse(localStorage.getItem("vehicle"));
          vehicle_make = vehicleData.mode_info.make_name;
          vehicle_model = vehicleData.mode_info.model_name;
          vehicle_year = vehicleData.mode_info.years;
          vehicle_generation = vehicleData.mode_info.generation_name;
          vehicle_license_plate = vehicleData.plate.toUpperCase();
          vehicle_colour = vehicleData.color;
          imageRecButtonText = "Run Image Recognition";
        }
        
      })
      .catch((error) => {
        console.log(error);
        imageRecError = "Unable to run image recognition, please type details below";
      });
  }

  function setVehicleData() {
    let vehicleData = JSON.parse(localStorage.getItem("vehicle"));
    vehicle_make = vehicleData.mode_info.make_name;
    vehicle_model = vehicleData.mode_info.model_name;
    vehicle_year = vehicleData.mode_info.years;
    vehicle_generation = vehicleData.mode_info.generation_name;
    vehicle_license_plate = vehicleData.plate.toUpperCase();
    vehicle_colour = vehicleData.color;

    let newVdata = {
      vMakeId: vehicleData.mode_info.make_id,
      vMake: vehicle_make,
      vModelId: vehicleData.mode_info.model_id,
      vModel: vehicle_model,
      vYear: vehicle_year,
      vGenId: vehicleData.mode_info.generation_id,
      vGen: vehicle_generation,
      vPlate: vehicle_license_plate,
      vTransmission: vehicle_transmission,
      vVin: vehicle_vin,
      vColour:vehicle_colour
    };

    localStorage.setItem("vehicle2", JSON.stringify(newVdata));
  }

  // handle submit
  function handleSubmit(e) {
    e.preventDefault();
    sumbitButtonText = "Processing claim...";
    //prepare data
    let cData = JSON.parse(localStorage.getItem("customer"));
    let vData = JSON.parse(localStorage.getItem("vehicle2"));
    let dData = JSON.parse(localStorage.getItem("history"));
    console.log(vData)
    console.log(dData)

    let fileInput = document.querySelector("#imageInput") as HTMLInputElement;

    let headers = new Headers();
    let formdata = new form();
    formdata.append("image", fileInput.files[0]);
    
    //Extra field recordID can be repurposed
    formdata.append("recordID", "1");
    
    formdata.append("membershipId", policyNumber);
    formdata.append("customer[givenName]", firstName);
    formdata.append("customer[lastName]", lastName);
    formdata.append("customer[phone]", phone);
    formdata.append("customer[email]", email);
    formdata.append("customer[address]", address);
    formdata.append("customer[dob]", dob);
    formdata.append("customer[driverSelected]", driverSelected);

    //The following group of inputs might be undefined depending on the aswer to driverSelect
    //If they are undefined they will be appened as ""
    formdata.append("customer[nonPolicyFirstName]", nonPolicyFirstName === undefined? "" : nonPolicyFirstName);
    formdata.append("customer[nonPolicyLastName]", nonPolicyLastName === undefined? "" :nonPolicyLastName);
    formdata.append("customer[nonPolicyPhone]", nonPolicyPhone === undefined? "" :nonPolicyPhone);
    formdata.append("customer[nonPolicyDoB]", nonPolicyDoB === undefined? "" :nonPolicyDoB);
    formdata.append("customer[nonPolicyRelation]", relationSelected === undefined? "" :relationSelected);
    formdata.append("customer[nonPolicyRelationOther]", nonPolicyDoB === undefined? "" : nonPolicyDoB);
    formdata.append("customer[driverPermission]", driverPermission === undefined? "" :driverPermission);
    formdata.append("customer[nonDriverHasInsurance]", nonDriverHasInsurance === undefined? "" :nonDriverHasInsurance);
    

    formdata.append("customerHistory[motorAccident]", motorAccident);
    formdata.append("customerHistory[convictedOffence]", convictedOfOffence);
    formdata.append("customerHistory[disqualified]", disqualified);
    formdata.append("customerHistory[refusedInsurance]", refusedInsurance);
    formdata.append("customerHistory[LicenceNumber]", licenceNumber);
    formdata.append("customerHistory[LicenceIssueDate]", licenceIssueDate);
    formdata.append("vehicle[vehicleId]",vehicle_vin);
    formdata.append("vehicle[plate]", vehicle_license_plate);

    formdata.append("vehicle[generation_name]", vehicle_generation);

    formdata.append("vehicle[make_name]", vehicle_make);

    formdata.append("vehicle[model_name]", vehicle_model);
    formdata.append("vehicle[years]", vehicle_year);

    formdata.append("vehicle[colour]", vehicle_colour);
    formdata.append("vehicle[engineNumber]", vehicle_transmission);

    let requestOptions = {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: headers,
      body: formdata,
      redirect: 'follow'
    };

    // Typescript doesnt like this, fix later
    fetch("https://dairies-rest-api.herokuapp.com/claims", requestOptions)
      // console.log response data
      .then(response => response.json())
      .then(data => {
        console.log("response data: ", data)
        // redirect to home page
        window.location.href = "/";
      })
      .catch(error => {
        sumbitButtonText = "Error Submitting Claim";
      });
  }

  // change dashes to slashes
  function changeDate(e) {
    let date = e.target.value;
    let newDate = date.replace(/-/g, "/");
    e.target.value = newDate;
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
  let relationSelectedOther;

  let driverPermission;
  let nonDriverHasInsurance;

  let motorAccident;
  let convictedOfOffence;
  let disqualified;
  let refusedInsurance;

  let licenceNumber;
  let licenceIssueDate


</script>

<svelte:head>
  <title>Submit a claim</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Claims</h2>

    <div class=" py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <Form {multiStepOptions}>
        <Step>
          <!-- Customer Information -->
          <div id="customerForm" class="pl-2 flex flex-col flex-wrap gap-5">
            <div id='floating_memberID_error' class="text-red-600 pt-3">
              {policyNumberError}
            </div>
            <div class="grid xl:grid-cols-2 xl:gap-6">

                <div class="relative z-0 w-full mb-6 group">
                  <input  
                  type="text"
                  name="membershipId"
                  id="floating_memberID"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  maxlength="8"
                  required
                  bind:value={policyNumber}
                  />
                  <label
                  for="floating_memberID"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Policy Number (XX000000)
                </label>
              </div>
              <div class="relative z-0 y- w-full mb-6 group">
                <button type="button" on:click={searchPolicyNumber} class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">{searchButtonText}</button>
              </div>
            </div>


            <!-- Once User has searched PolicyID the rest of the form will appear -->
            {#if customerSearched}
                      
              <div class="grid xl:grid-cols-2 xl:gap-6">
                
                <div class="relative z-0 w-full mb-6 group">
                  <input
                    type="text"
                    name="givenName"
                    id="floating_first_name"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    placeholder=" "
                    maxlength="50"
                    required
                    bind:value={firstName}
                  />
                  <label
                    for="floating_first_name"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >First name of Insured</label
                  >
                  <!-- For adding format error messages -->
                  <div id="floating_first_name_error" class="text-red-600 pt-1"></div>
                </div>
                <div class="relative z-0 w-full mb-6 group">
                  <input
                    type="text"
                    name="lastName"
                    id="floating_last_name"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    placeholder=" "
                    maxlength="50"
                    required
                    bind:value={lastName}
                  />
                  <label
                    for="floating_last_name"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Last name of Insured</label
                  >
                  <!-- For adding format error messages -->
                  <div id="floating_last_name_error" class="text-red-600 pt-1"></div>
                </div>
              </div>
              <div class="grid xl:grid-cols-2 xl:gap-6">
                <div class="relative z-0 w-full mb-6 group">
                  <input
                    type="tel"
                    name="phone"
                    id="floating_phone"
                    on:focusout={formatPhone}
                    class="block py-5 xl:py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    placeholder=" "
                    maxlength="14"
                    required
                    bind:value={phone}
                  />
                  <label
                    for="floating_phone"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Phone number (614XXXXXXXX)</label
                  >
                  <!-- For adding format error messages -->
                  <div id="floating_phone_error" class="text-red-600 pt-1"></div>
                </div>
                <div class="relative z-0 w-full mb-6 group">
                  <input
                    type="date"
                    name="dob"
                    id="floating_date"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    placeholder=" "
                    min="1900-01-01" 
                    max= {max_date}
                    required
                    bind:value={dob}
                  />
                  <label
                    for="floating_date"
                    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Date of Birth (dd/mm/yyyy)</label
                  >
                  <!-- For adding format error messages -->
                  <div id="floating_date_error" class="text-red-600 pt-1"></div>
                </div>
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="emailAddress"
                  id="floating_email"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  maxlength="50"
                  required
                  bind:value={email}
                />
                <label
                  for="floating_email"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Email address</label
                >
                <!-- For adding format error messages -->
                <div id="floating_email_error" class="text-red-600 pt-1"></div>
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
                  maxlength="100"
                  required
                />
                <label
                  for="floating_address"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Address</label
                >
                <!-- For adding format error messages -->
                <div id="floating_address_error" class="text-red-600 pt-1"></div>
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
                <select
                  name="lastRider"
                  id="floating_last_rider"
                  class="block py-5 xl:py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  bind:value={driverSelected}
                  required
                >
                  <option disabled value="" class="text-gray-600">Select</option>
                  {#each driverOptions as option}
                    <option class="text-black" value={option.id}>
                      {option.text}
                    </option>
                  {/each}
                </select>
                <label
                  for="floating_last_rider"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Was the policy holder the last person to use the vehicle?</label
                >
                <!-- For adding format error messages -->
                <div id="floating_last_rider_error" class="text-red-600 pt-1"></div>
              </div>
            {/if}

            <!-- IF Policy Holder NOT last to use the vehicle -->
            <div class="relative z-0 w-full mb-6 group">
              {#if driverSelected}
                {#if driverSelected === 2}
                  <div>
                    <div class="grid xl:grid-cols-2 xl:gap-6">
                      <div class="relative z-0 w-full mb-6 group">
                        <input
                          type="text"
                          name="nonPolicyFirstName"
                          id="non_policy_first_name"
                          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                          placeholder=" "
                          maxlength="50"
                          required
                          bind:value={nonPolicyFirstName}
                        />
                        <label
                          for="non_policy_first_name"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >First name of Last Driver</label
                        >
                        <!-- For adding format error messages -->
                        <div id="non_policy_first_name_error" class="text-red-600 pt-1"></div>
                      </div>
                      <div class="relative z-0 w-full mb-6 group">
                        <input
                          type="text"
                          name="nonPolicyLastName"
                          id="non_policy_last_name"
                          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                          placeholder=" "
                          maxlength="50"
                          required
                          bind:value={nonPolicyLastName}
                        />
                        <label
                          for="non_policy_last_name"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Last name of Last Driver</label
                        >
                        <!-- For adding format error messages -->
                        <div id="non_policy_last_name_error" class="text-red-600 pt-1"></div>
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
                          maxlength="11"
                          required
                          bind:value={nonPolicyPhone}
                        />
                        <label
                          for="non_policy_phone"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Phone number of Last Driver</label
                        >
                        <!-- For adding format error messages -->
                        <div id="non_policy_phone_error" class="text-red-600 pt-1"></div>
                      </div>
                      <div class="relative z-0 w-full mb-6 group">
                        <input
                          type="date"
                          name="nonPolicyDoB"
                          id="non_policy_date"
                          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                          placeholder=" "
                          min="1900-01-01" 
                          max= {max_date}
                          required
                          bind:value={nonPolicyDoB}
                        />
                        <label
                          for="non_policy_date"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Date of Birth of Last Driver</label
                        >
                        <!-- For adding format error messages -->
                        <div id="non_policy_date_error" class="text-red-600 pt-1"></div>
                      </div>
                    </div>
                    <div class="relative z-0 my-10 w-full mb-6 group">
                      <select
                        name="driverRelation"
                        id="floating_relation"
                        class="block py-5 xl:py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                        bind:value={relationSelected}
                        required
                      >
                        <option disabled value="" class="text-gray-600">Select</option>
                        {#each relation as option}
                          <option class="text-black" value={option.id}>
                            {option.text}
                          </option>
                        {/each}
                      </select>
                      <label
                        for="floating_relation"
                        class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >What was the drivers relation to the policy holder?</label
                      >
                      <!-- For adding format error messages -->
                      <div id="floating_relation_error" class="text-red-600 pt-1"></div>
                      {#if relationSelected}
                        {#if relationSelected === 5}
                          <div class="relative mt-5 z-0 w-full mb-6 group">
                            <input
                              type="text"
                              name="relationOtherDetails"
                              id="relation_other"
                              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                              placeholder=" "
                              maxlength="50"
                              required
                              bind:value={relationSelectedOther}
                            />
                            <label
                              for="relation_other"
                              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >Details</label
                            >
                            <!-- For adding format error messages -->
                            <div id="relation_other_error" class="text-red-600 pt-1"></div>
                          </div>
                        {/if}
                      {/if}
                    </div>
                    <div class="my-4">
                      <div
                        id="driver_permission_question"
                        class="text-lg text-gray-500 dark:text-gray-400"
                      >Did the last driver have the policy holder's permission to use the vehicle?
                      </div
                      >
                      <label class="pl-1 pr-4">
                        <input type="radio" bind:group={driverPermission} name="driverPermission" id="driver_permission_yes" value={1}>
                        Yes
                      </label>
                      <label class="px-4">
                        <input type="radio" bind:group={driverPermission} name="driverPermission" id="driver_permission_no" value={2}>
                        No
                      </label>
                    </div>
                    <div class="my-4">
                      <div
                        id="last_driver_insurance_question"
                        class="text-lg text-gray-500 dark:text-gray-400"
                      >Does the last driver have motor vehicle insurance?
                      </div
                      >
                      <label class="pl-1 pr-4">
                        <input type="radio" bind:group={nonDriverHasInsurance} name="nonDriverHasInsurance" id="non_driver_has_insurance_yes" value={1}>
                        Yes
                      </label>
                      <label class="px-4">
                        <input type="radio" bind:group={nonDriverHasInsurance} name="nonDriverHasInsurance" id="non_driver_has_insurance_no" value={2}>
                        No
                      </label>
                    </div>


                  </div>
                {/if}
              {/if}
            </div>
          </div>
        </Step>
       <!-- Driver History Form -->
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
                  required
                  bind:value={licenceNumber}
                />
                <label
                  for="licenseNumber"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Licence Number</label
                >
                <!-- For adding format error messages -->
                <div id="licenseNumber_error" class="text-red-600 pt-1"></div>
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="date"
                  name="LicenceIssueDate"
                  id="licenseIssueDate"
                  class="block py-5 xl:py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  required
                  min="1900-01-01" 
                  max= {max_date}
                  bind:value={licenceIssueDate}
                />
                <label
                  for="licenseIssueDate"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Licence issue date (dd/mm/yyyy)</label
                >
                <!-- For adding format error messages -->
                <div id="licenseIssueDate_error" class="text-red-600 pt-1"></div>
              </div>
            </div>
          </div>
        </Step>
        <Step>
          <!-- Upload Image -->
        <div class="flex justify-center">
          <div class="mb-3 w-96">
            <label for="imageInput" class="form-label inline-block mb-2 text-gray-500 dark:text-gray-400">Upload File</label>
            <input id="imageInput"  type="file" class="form-control
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                   >
          </div>
        </div>
        <div class="flex justify-center">
          <button type="button" on:click={getClaim} class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">{imageRecButtonText}</button>
        </div>
        <div class="flex justify-center">
          <div class="text-red-600 pt-3">
            {imageRecError}
          </div>
        </div>

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
                  required
                  maxlength="50"
                />
                <label
                  for="floating_vehicleMake"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle Make</label
                >
                <!-- For adding format error messages -->
                <div id="floating_vehicleMake_error" class="text-red-600 pt-1"></div>
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="model"
                  id="vehicleModel"
                  class="vehicle block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  required
                  maxlength="50"
                  bind:value={vehicle_model}
                />
                <label
                  for="vehicleModel"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle Model</label
                >   
                <!-- For adding format error messages -->
                <div id="vehicleModel_error" class="text-red-600 pt-1"></div>
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
                  required
                  maxlength="9"
                  bind:value={vehicle_year}
                />
                <label
                  for="floating_vehicle_year"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle Year of Make (range)</label
                >
                <!-- For adding format error messages -->
                <div id="floating_vehicle_year_error" class="text-red-600 pt-1"></div>
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="generation"
                  id="floating_vehicle_generation"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  required
                  maxlength="50"
                  bind:value={vehicle_generation}
                />
                <label
                  for="floating_vehicle_generation"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle Generation</label
                >
                <!-- For adding format error messages -->
                <div id="floating_vehicle_generation_error" class="text-red-600 pt-1"></div>
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="vehicleLicense"
                  id="floating_vehicle_license"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  required
                  maxlength="6"
                  bind:value={vehicle_license_plate}
                />
                <label
                  for="floating_vehicle_license"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle License Plate</label
                >
                <!-- For adding format error messages -->
                <div id="floating_vehicle_license_error" class="text-red-600 pt-1"></div>
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="vehicleColour"
                  id="floating_vehicle_colour"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  required
                  maxlength="20"
                  bind:value={vehicle_colour}
                />
                <label
                  for="floating_vehicle_colour"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Colour</label
                >
                <!-- For adding format error messages -->
                <div id="floating_vehicle_colour_error" class="text-red-600 pt-1"></div>
              </div>
            </div>
            <div class="grid xl:grid-cols-2 xl:gap-6">
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="engine"
                  id="floating_engine"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  required
                  bind:value={vehicle_transmission}
                />
                <label
                  for="floating_engine"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle Tansmission Type</label
                >
                 <!-- For adding format error messages -->
                 <div id="floating_engine_error" class="text-red-600 pt-1"></div>
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="vehicleId"
                  id="floating_vehicleId"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  maxlength="50"
                  required
                  bind:value={vehicle_vin}
                  on:focusout={setVehicleData}
                />
                <label
                  for="floating_vehicleId"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Vehicle ID</label
                >
                <!-- For adding format error messages -->
                <div id="floating_vehicleId_error" class="text-red-600 pt-1"></div>
              </div>
            </div>
          </div>
        </Step>
        <Step>
          <div id="reviewForm" class="p-5 flex flex-col flex-wrap gap-5">
            <p>Please Review your Form Before Submitting, Once the form is Submitted, It <span class="text-red-600">CANNOT</span>
              be deleted.</p>
          </div>
          <div class="grid grid-cols-5 gap-1">
            <div></div>
            <div></div>
            <div></div>
            <div>  
              <button
                on:click={handleSubmit}
                class=" mx-5 px-5 py-3 font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              >
              {sumbitButtonText}
              </button>
            </div>
            <div></div>
          </div>
          
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
    ::-webkit-calendar-picker-indicator {
    filter: invert(1);
}
</style>

