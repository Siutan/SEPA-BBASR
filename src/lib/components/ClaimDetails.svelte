<script>
    import Switch from "./Switch.svelte";

    export let ID;
    let detailedClaim;
    let detailedImage = "";

    async function getClaimData(claimId) {
        console.log("getClaimDataCalled");
        console.log("claimID:", claimId.ID);

        let url = "https://dairies-rest-api.herokuapp.com/claims/json/" + claimId.ID;
        await fetch(url, {
        method: "GET",
        credentials: "include",
        mode: "cors"
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(`Claim: ${JSON.stringify(data)}`)
            detailedClaim = data;
            getImage(claimId);
            
        })
        .catch((error) => {
            console.log(`error: ${error}`);
            return error;
        });
    }

      // get image from claim id
  async function getImage(claimId) {
    let url = "https://dairies-rest-api.herokuapp.com/claims/image/" + claimId.ID;
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


    function formatDate(date) {
        let d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();

        let year = d.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [day, month, year].join("-");
    }

</script>

{#await getClaimData({ID})}
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

{:then claimData}
<div >
  <div>
    <p class="text-left font-semibold text-xl pb-9">Claim Details: {ID}</p>
  </div> 
  <div class="flex flex-row px-9 gap-4">
    <div class="flex flex-col gap-4 ">
      <p class="font-semibold text-xl p-2">Policy Holder Details</p>
      <div class="grid xl:grid-cols-2 xl:gap-6">
        <div class="relative z-0 w-full mb-6 group">
          <input

            type="text"
            name="givenName"
            id="floating_first_name"
            class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
            placeholder=" "
            readonly
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
            readonly
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
      </div>
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
            bind:value={detailedClaim.customer.nonPolicyLastName}
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
            for="non_policy_date"
            class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
          >Date of Birth of Last Driver</label
          >
        </div>
      </div>
      <div class="relative z-0 my-10 w-full mb-6 group">
        <select
          name="driverRelation"
          bind:value={detailedClaim.customer.relationSelected}
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
      {#if detailedClaim.customer.relationSelected === "5"}
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
    <!-- <div class="flex flex-col gap-4 ">
      <p>First Name: {detailedClaim.customer.givenName}</p>

  </div> -->
  <div class="flex flex-col gap-4 ">
    <p class="font-semibold text-xl p-2">Vehicle details</p>
    <div class="mx-auto">
        <img class="w-96"
        src={detailedImage.imageLink} alt="Image" />
    </div>
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
          </div>
        </div>
      </div>
      
    </div>
    
  </div>
  
  </div>
</div>
{:catch error}
    <div>Unable to fetch data: {error}</div>
{/await}

<style>

</style>