import { currentStep } from './stores.js'
import {
  UUID_PATTERN,
  ERROR_DISPLAY_TIME,
  BUTTON_OPACITY,
  BUTTON_DISABLED_OPACITY,
} from './constants.js'

let activeStep
currentStep.subscribe((value) => {
  activeStep = value
})

let required_key = 
{
  "givenName":"Please enter the first name of the insured",
  "lastName":"Please enter the last name of the insured",
  "phone":"Please enter the phone number of the insured",
  "dob":"Please enter the date of birth of the insured",
  "emailAddress":"Please enter the email of the insured",
  "address":"Please enter a valid email address for the insured",
  "membershipId":"Please enter the policy number of the insured",
  "lastRider":"Please answer if the policy holder was the last to use the vehicle",
  "nonPolicyFirstName":"Please enter the first name of the non-policy driver",
  "nonPolicyLastName":"Please enter the last name of the non-policy driver",
  "nonPolicyPhone":"Please enter the phone number of the non-policy driver",
  "nonPolicyDoB":"Please enter the date of birth of the non-policy driver",
  "driverRelation":"Please select the drivers relationship",
  "relationOtherDetails":"Please add details for 'other' selection",
  "driverPermission":"Please answer if the non-policy driver had permission to use the car",
  "nonDriverHasInsurance":"Please answer if the non-policy driver has insurance",



}

export const formHasError = () => {
  const steps = document.querySelectorAll('.step')
  const step = steps[activeStep]

  const requiredFields = step.querySelectorAll('[required]')
  let hasError = false
  let errorMessages = []

  //checks all required fields for an input
  requiredFields.forEach((el) => {
    
    if (!el.checkValidity()) {
      hasError = true
      errorMessages.push(required_key[el.name])
      
    }
  })

  //validate first name
  const firstName = document.getElementById('floating_first_name').value;
  let regexName = /^[A-Za-z]+$/;
  if(firstName){

    if(firstName.match(regexName))
    {
      console.log("valid first name");
    }
    else{
      console.log("Not valid first name")
      hasError = true
      errorMessages.push("Please use only letter characters for first name of insured");
    }
  }

  //validate last name
  const lastName = document.getElementById('floating_last_name').value;
  if(lastName){

    if(lastName.match(regexName))
    {
      console.log("valid last name");
    }
    else{
      console.log("Not valid last name")
      hasError = true
      errorMessages.push("Please use only letter characters for last name of insured");
    }
  }

  //validate phone number
  const phone = document.getElementById('floating_phone').value;
  let regexPhone = /^61 4\d{2}-\d{3}-\d{3}$/
  if(phone){

    if(phone.match(regexPhone))
    {
      console.log("valid phone format");
    }
    else{
      console.log("Not valid phone format")
      hasError = true
      errorMessages.push("Please use an Australian number in the format '614XXXXXXXX'");
    }
  }

  
  //validate datestring
  const dateString = document.getElementById('floating_date').value;
  let regexDate = /^\d{4}\-\d{2}\-\d{2}$/;
  if(dateString)
  {
    console.log('date: ', dateString);
    //check that date is in correct format
    if(dateString.match(regexDate)){
      console.log("valid format")
      var d = new Date(dateString);
      var dNum = d.getTime();
      
      //Check if is a valid date
      if(!dNum){
        hasError = true
        errorMessages.push("The Date of Birth given is not a valid date");
      }
      //Apply error if dob is before 1900
      const dMin = new Date("1900-1-1").getTime();
      
      if((dMin - dNum) > 0){
        hasError = true
        errorMessages.push("The Date of Birth needs to be after '1900-01-01'");
      }

      //Apply error if dob is in the future
      const dMax = new Date().getTime();
      if(dMax - dNum <= 0 ){
        hasError = true
        errorMessages.push("The Date of Birth cannot be in the future");
      }
    }
    else{
      console.log("invalid date format")
      hasError = true
      errorMessages.push("Please enter Date of Birth in yyyy-mm-dd format");
    }
  }
  
  //validate email 
  const email = document.getElementById('floating_email').value;
  let regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if(email){

    if(email.match(regexEmail))
    {
      console.log("valid email format");
    }
    else{
      console.log("Not valid email format")
      hasError = true
      errorMessages.push("Please use a valid email address");
    }
  }

    //validate address 
    const address = document.getElementById('floating_address').value;
    let regexAddress = /^[a-zA-Z0-9, \/\(\)]+$/
    if(address){
  
      if(address.match(regexAddress))
      {
        console.log("valid address");
      }
      else{
        console.log("Not valid address format")
        hasError = true
        errorMessages.push("Please use only letters, characters and '/' as part of an address");
      }
    }

    //validate membershipID 
    const membershipID = document.getElementById('floating_memberID').value;
    let regexMembership = /^[A-Z]{2}\d{6}$/
    if(membershipID){
  
      if(membershipID.match(regexMembership))
      {
        console.log("valid membershipID");
      }
      else{
        console.log("Not valid membership ID format")
        hasError = true
        errorMessages.push("The membership ID should be two capital letters followed by 6 numbers: `XX000000`");
      }
    }

    //Check if policy holder was last one driving
    let lastRider = document.getElementById('floating_last_rider').value;
    if(lastRider == 2)
    {
      
      //validate first name of last rider
      const nonPolicyFirstName = document.getElementById('non_policy_first_name').value;
      if(nonPolicyFirstName){
    
        if(nonPolicyFirstName.match(regexName))
        {
          console.log("valid first name of non-policy rider");
        }
        else{
          console.log("Not valid first name of non-policy rider")
          hasError = true
          errorMessages.push("Please use only letter characters for first name of non-policy rider");
        }
      }

      //validate last name of last rider
      const nonPolicyLastName = document.getElementById('non_policy_last_name').value;
      if(nonPolicyLastName){
    
        if(nonPolicyLastName.match(regexName))
        {
          console.log("valid last name of non-policy rider");
        }
        else{
          console.log("Not valid last name of non-policy rider")
          hasError = true
          errorMessages.push("Please use only letter characters for last name of non-policy rider");
        }
      }

      //validate phone number
      const nonPolicyPhone = document.getElementById('non_policy_phone').value;

      if(nonPolicyPhone){

        if(nonPolicyPhone.match(regexPhone))
        {
          console.log("valid phone format for last rider");
        }
        else{
          console.log("Not valid phone format for last rider")
          hasError = true
          errorMessages.push("Please use an Australian number in the format '614XXXXXXXX' for the last rider");
        }
      }

      
      //validate date of birth of last rider
      const nonPolicyDate = document.getElementById('non_policy_date').value;
      if(nonPolicyDate)
      {
        
        //check that date is in correct format
        if(nonPolicyDate.match(regexDate)){
          console.log("valid format")
          var d = new Date(dateString);
          var dNum = d.getTime();
          
          //Check if is a valid date
          if(!dNum){
            hasError = true
            errorMessages.push("The Date of Birth of the last rider is not a valid date");
          }
          //Apply error if dob is before 1900
          const dMin = new Date("1900-1-1").getTime();
          
          if((dMin - dNum) > 0){
            hasError = true
            errorMessages.push("The Date of Birth for the last rider needs to be after '1900-01-01'");
          }

          //Apply error if dob is in the future
          const dMax = new Date().getTime();
          if(dMax - dNum <= 0 ){
            hasError = true
            errorMessages.push("The Date of Birth of the last rider cannot be in the future");
          }
        }
        else{
          console.log("invalid date format")
          hasError = true
          errorMessages.push("Please enter Date of Birth of last rider in 'yyyy-mm-dd format'");
        }
      }

      //check if relation selected was other
      let relation = document.getElementById('floating_relation').value;
      if(relation == 5){
        //validate other relation details
        let otherDetails = document.getElementById('relation_other').value;
        if(otherDetails){
          
          if(otherDetails.match(regexName))
          {
            console.log("valid other details ");
          }
          else{
            console.log("Not valid input for other relation details")
            hasError = true
            errorMessages.push("Please use only letter characters for other relation details");
          }
        }
      }

      //check if permission question was answered
      let permission = document.getElementsByName("driverPermission");
      console.log("permissiony: ", permission[0].checked)
      console.log("permissionn: ", permission[1].checked)
      if(permission[0].checked || permission[1].checked){

        console.log("Permission question selected")
      }else{
        console.log("Permission question not selected")
        hasError = true
        errorMessages.push("Please answer if user had permission to drive car");
      }

      //check if last driver has insurance question was answered
      let insurance = document.getElementsByName("nonDriverHasInsurance");
      console.log("insurancey: ", insurance[0].checked)
      console.log("insurancen: ", insurance[1].checked)
      if(insurance[0].checked || insurance[1].checked){

        console.log("insurance question selected")
      }else{
        console.log("Insurance question not selected")
        hasError = true
        errorMessages.push("Please answer if user had permission to drive car");
      }
    }
  if (hasError) {
    showError(errorMessages)
    console.log("errorMessages", errorMessages);
  }
  return hasError
}

export const showError = (errorMessages) => {
  let errorField = document.querySelector('#multistep-error-messages')

  deleteChildNodes(errorField)
  showOrHide(errorField, 'visible')

  errorMessages.forEach((message) => {
    createElementAppendTo('p', message, errorField)
  })

  setTimeout(() => {
    showOrHide(errorField, 'hidden')
  }, ERROR_DISPLAY_TIME)
}

export const updateStepStatus = (operation) => {
  if (!operation) return
  const steps = document.querySelectorAll('.step')

  steps[activeStep].classList.remove('step-is-active')
  steps[activeStep].classList.add('step-not-active')

  operation()

  steps[activeStep].classList.remove('step-not-active')
  steps[activeStep].classList.add('step-is-active')

  updateButtonVisibility()
}

export const updateButtonVisibility = () => {
  const steps = document.querySelectorAll('.step')
  const stepsLength = steps.length

  const prev = document.querySelector('#multistep-prev')
  const next = document.querySelector('#multistep-next')

  prev.style.opacity = BUTTON_OPACITY
  next.style.opacity = BUTTON_OPACITY

  if (activeStep === 0) {
    prev.style.opacity = BUTTON_DISABLED_OPACITY
  }
  if (activeStep === stepsLength - 1) {
    next.style.opacity = BUTTON_DISABLED_OPACITY
  }
}

export const showOrHide = (el, status) => {
  if (!el) return

  const statusOptions = {
    hidden: BUTTON_DISABLED_OPACITY,
    visible: BUTTON_OPACITY,
  }

  el.style.visibility = statusOptions[status] ? status : null
  el.style.opacity = statusOptions[status] ? statusOptions[status] : null
}

// TODO: think about it if this is nedeed or useless
export const uuidv4 = () => {
  return UUID_PATTERN.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const deleteChildNodes = (el) => {
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
}

export const createElementAppendTo = (type, content, target) => {
  let el = document.createElement(type)
  el.innerHTML = content
  target.appendChild(el)
}
