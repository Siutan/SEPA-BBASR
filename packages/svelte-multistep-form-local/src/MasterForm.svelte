<script>
  import { onMount, afterUpdate } from 'svelte'
  import { currentStep } from './stores.js'
  import { uuidv4, formHasError, updateStepStatus, updateButtonVisibility } from './helpers.js'

  export let multiStepOptions
  export let resetSteps
  /*
  Lifecycle Hooks
  */
  onMount(async () => {
    let steps = document.querySelectorAll('.step')

    steps.forEach((step, index) => {
      step.setAttribute('id', uuidv4())
      step.dataset.stepNumber = index
      if ($currentStep === index) {
        step.classList.remove('step-not-active')
        step.classList.add('step-is-active')
      }
    })

    updateButtonVisibility()
  })

  afterUpdate(async () => {
    if (resetSteps) {
      updateStepStatus(stepStore.reset)
      resetSteps = false
    }
  })

  /*
  App-navigation
  */
  export function nextStep() {
    const steps = document.querySelectorAll('.step')

    // get form data from current step
    const currentStep = document.querySelector('.step-is-active')
    const currentStepForm = currentStep.querySelector('input')
    // const currentStepFormData = new FormData(currentStepForm)
    // const currentStepFormDataEntries = currentStepFormData.entries()
    console.log(currentStepForm)


    if (formHasError()) {
      return
    }
    if ($currentStep + 1 <= steps.length - 1) {
      updateStepStatus(currentStep.increment)
    }
  }

  export const previousStep = () => {
    if ($currentStep - 1 > -1) {
      updateStepStatus(currentStep.decrement)
    }
  }
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
            <svg viewBox="0 0 32 32" style="fill:#9061f9">
              <path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z" />
            </svg>
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
    position: absolute;
    right: 0;
    height: auto;
    width: auto;
    border-left: 10px solid red;
    text-align: left;
    padding-left: 10px;
    background: #fff;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.2s linear;
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
</style>
