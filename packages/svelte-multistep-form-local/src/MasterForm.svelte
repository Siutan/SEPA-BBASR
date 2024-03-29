<script>
  //TODO:
  // - add is empty validation
  // - add input sanitization

  import { onMount, afterUpdate } from "svelte";
  import { currentStep as stepStore, currentStep } from "./stores.js";
  import { uuidv4, formHasError, updateStepStatus, updateButtonVisibility } from "./helpers.js";
  import axios from "axios";
  import FormData from "form-data";

  const BASE_URL = import.meta.env.VITE_BASE_URL

  export let multiStepOptions;
  export let resetSteps;

  let index = 0;

  /*
  Lifecycle Hooks
  */
  onMount(async () => {
    let steps = document.querySelectorAll(".step");

    steps.forEach((step, index) => {

      step.setAttribute("id", uuidv4());
      step.dataset.stepNumber = index;
      if ($currentStep === index) {
        step.classList.remove("step-not-active");
        step.classList.add("step-is-active");
      }
    });

    updateButtonVisibility();
  });

  afterUpdate(async () => {
    if (resetSteps) {
      updateStepStatus(stepStore.reset);
      resetSteps = false;
    }
  });

  function fetchCustomerData(requestData) {
    let customerGetUrl =
      `${BASE_URL}/customers/${requestData["membershipId"]}`;
    let customerPostUrl = `${BASE_URL}/customers/`;
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
          // if the customer doesn't exist, create a new customer
          fetch(customerPostUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            mode: "cors",
            credentials: "include",
            // send the request data as the new customer details in the body
            body: JSON.stringify(requestData)
          })
            .then((response) => response.json())
            .then((res) => {

              localStorage.setItem("customer", JSON.stringify(res));
            })
            .catch((error) => {
      
            });
        } else {


          localStorage.setItem("customer", JSON.stringify(data));
        }
      })
      .catch((error) => {

      });
  }

  function fetchVehicleData(vehicleForm) {
    let data = new FormData();
    let vehicleImage = document.querySelector("#imageInput");
    data.append("image", vehicleImage.files[0]);
    let config = {
      method: "post",
      url: `${BASE_URL}/claims/autogen`,
      headers: {
        "Content-Type": "multipart/form-data"
      },
      mode: "cors",
      credentials: "include",
      data: data
    };
    axios(config)
      .then((response) => {

        localStorage.setItem("vehicle", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

  }


  function handleForm(stepDirection) {



    let customerForm = document.getElementById("customerForm");
    let imageForm = document.getElementById("imageForm");
    let vehicleForm = document.getElementById("vehicleForm");
    let historyForm = document.getElementById("historyForm");
    let customerFormExists = document.body.contains(customerForm);
    let imageFormExists = document.body.contains(imageForm);
    let vehicleFormExists = document.body.contains(vehicleForm);
    let historyFormExists = document.body.contains(historyForm);


    if (customerFormExists) {
      // get inputs inside customerForm
      let customerFormInputs = customerForm.querySelectorAll("input");
      let customerFormSelects = customerForm.querySelectorAll("select");
      let customerFormData = {};
      customerFormInputs.forEach((input) => {
        customerFormData[input.name] = input.value;
      });
      customerFormSelects.forEach((select) => {

        customerFormData[select.name] = select.selectedIndex;
      });
      // check if Member ID exists in database
      // if it does, get the customer's data from the database
      // if it doesn't, create a new customer in the database
      // then get the customer's data from the database
      fetchCustomerData(customerFormData);
 
    }


    if (imageFormExists) {

      if (vehicleFormExists) {
        fetchVehicleData(vehicleForm);
      }
      // get inputs inside imageForm
      let imageFormInputs = imageForm.querySelectorAll("input");
      let imageFormSelects = imageForm.querySelectorAll("select");
      let imageFormData = {};
      imageFormInputs.forEach((input) => {
        imageFormData[input.name] = input.value;
      });
      imageFormSelects.forEach((select) => {

        imageFormData[select.name] = select.selectedIndex;
      });

    }

    let historyFormInputs = historyForm.querySelectorAll("input");
    let historyFormData = {};
    historyFormInputs.forEach((input) => {
      historyFormData[input.name] = input.value;
    });

    localStorage.setItem("history", JSON.stringify(historyFormData));
  }

  /*
  App-navigation
  */
  export function nextStep() {
    handleForm("next");
    const steps = document.querySelectorAll(".step");
    
    //validate form inputs
    if (formHasError()) {
      return;
    }
    
    if ($currentStep + 1 <= steps.length - 1) {
      updateStepStatus(currentStep.increment);
    }
  }

  export const previousStep = () => {
    handleForm("previous");
    if ($currentStep - 1 > -1) {
      updateStepStatus(currentStep.decrement);
    }
  };

</script>

<div class="multistep-master-form">
  <div id="multistep-error-messages" />
  <h1 class="multistep-form-title">{multiStepOptions.formTitle}</h1>
  <h5 class="multistep-form-subtitle">{multiStepOptions.formSubtitle}</h5>
  <form class="multistep-form">
    <div class="multistep-left-sidebar">
      {#each multiStepOptions.stepsDescription as step}
        <div class="multistep-title-side">
          <span class="name">{step.title}</span>
          <span class="subtitle">{step.subtitle}</span>
        </div>
      {/each}
    </div>
    <div class="separator hidden md:block lg:block">
      {#each multiStepOptions.stepsDescription as step, index}
        <div class="separator-line">
          <span class="dot" />
        </div>
        {#if $currentStep === index}
          <div class="separator-check-current" />
        {:else if $currentStep > index}
          <div class="separator-check">
          </div>
        {:else if $currentStep < index}
          <div class="separator-check-pending" />
        {/if}
      {/each}
    </div>
    <!-- This slot represents StepForm  -->
    <div class="multistep-right-sidebar transition duration-700 ease-in-out">
      <slot />
    </div>
    <!-- end of  StepForm  -->
  </form>
  <div class="multistep-continue-button noselect">
    <span on:click={previousStep} id="multistep-prev">prev</span>
    |
    <span on:click={nextStep} id="multistep-next">next</span>
  </div>
</div>

<style>
    .name {
        color: #848383;
    }

    .subtitle {
        color: rgb(223, 219, 219);
        display: block;
    }

    .multistep-form {
        display: flex;
    }

    .separator,
    .multistep-left-sidebar {
        flex: 1;
    }

    .separator {
        margin-top: 40px;
    }

    .multistep-right-sidebar {
        flex: 3;
        text-align: left;
    }

    .multistep-continue-button {
        float: right;
    }

    .separator-check {
        width: 30px;
        height: 30px;
        margin: 0 auto;
        border-radius: 50%;
        box-shadow: 0 0 0 2px #9061f9;
        padding: 12px 10px 2px;
        z-index: 10;
    }

    .separator-check-pending {
        width: 30px;
        height: 30px;
        margin: 0 auto;
        border-radius: 50%;
        background-color: #3d0796;
        box-shadow: 0 0 0 2px #3d0796;
        z-index: 10;
    }

    .separator-check-current {
        width: 30px;
        height: 30px;
        margin: 0 auto;
        border-radius: 50%;
        background: #9061f9;
        z-index: 10;
        box-shadow: 0 1px 8px #9061f9;
    }

    .separator-line {
        border-right: 2px solid #ccc;
        margin: 0 auto;
        position: relative;
        height: 40px; /* placeholder, should be displayed dynamically*/
        width: 1px;
        margin-bottom: 2px;
        margin-top: 2px;
    }

    .multistep-master-form {
        padding: 30px;
        height: 100%;
    }

    #multistep-prev {
        cursor: pointer;
        margin-right: 20px;
    }

    #multistep-next {
        cursor: pointer;
        margin-left: 20px;
    }

    .dot {
        height: 8px;
        width: 8px;
        background-color: #bbb;
        border-radius: 50%;
        display: inline-block;
        margin-left: -2px;
        margin-top: 18px;
    }

    .multistep-title-side {
        margin-top: 40px;
        text-align: right;
    }

    .multistep-form-title {
        text-align: left;
        color: #636262;
        font-weight: bold;
    }

    .multistep-form-subtitle {
        text-align: left;
        color: rgb(223, 219, 219);
        margin-bottom: 30px;
        font-weight: lighter;
    }

    #multistep-error-messages {
        position: sticky;
        display: block;
        top: 0;
        height: auto;
        width: auto;
        /* padding: 20px 100px 20px 100px; */
        background: rgb(205, 33, 33);
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.2s linear;
        color: white;
        text-align: center;
        font-weight: bold;
        z-index: 1;
    }
        @media only screen and (min-width: 601px) {
          #multistep-error-messages{
            padding: 20px 100px;
          }
        }
        @media only screen and (max-width: 600px) {
          #multistep-error-messages{
            padding: 0px 20px 
          }
        }

    


    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        /* Non-prefixed version, currently
                                         supported by Chrome, Edge, Opera and Firefox */
    }
</style>
