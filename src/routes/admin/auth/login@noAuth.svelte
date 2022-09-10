<script lang="ts">
  import Input from "../../../lib/components/Input.svelte";
  import { goto } from "$app/navigation";


  let employeeId = "";
  let employeeIdError = "";
  let password = "";
  let passwordError = "";
  let postError = "";

  let loading = false;



  //get email input, dispatched from the child 'Input' component
  const getEmployeeId = (e) => {
    employeeId = e.detail;
  }

  //get password input, dispatched from the child 'Input' component
  const getPassword = (e) => {
    password = e.detail;
  }

  //function called when login button is clicked 
  function submitLogin(){
    // clear any error from previous login attempt
    postError = "";

    //add loading icon
    loading = true;
    
    //check if inputs are valid
    if(validInputs()){

      //Post to the login endpoint
      fetch('https://dairies-rest-api.herokuapp.com/auth/login', {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "employeeId": `${employeeId}`,
            "password": `${password}`
          })
        })
        .then(response => response.json())
        .then((data) => {
          console.log(data);
          postError = "";
          if(data.message)
          {
            postError = `Error Logging in with credentials`;
            loading = false;
          }
          else{

            //call redirect function
            loginSuccess(data);
          }

        })
        .catch((error) => {
          console.log(`Error: ${error}`);
          
          loading = false;
          postError = `Error Logging in with credentials`;

      });
    }  
    
  }

  function validInputs(){
    if(employeeId.length == 0)
    {
      employeeIdError = "Employee Id must be entered";
      loading = false;
    }
    else{
      employeeIdError = "";
    }

    if(password.length == 0){
      passwordError = "Please enter a password"
      loading = false;
    }
    else{
      passwordError = "";
    }

    //if no errors return true, otherwise return false
    return passwordError == "" && employeeIdError == "";


  }

  //if Login is a success store cookie and redirect them to logged in dashboard
  function loginSuccess(data){
    
    loading = false;

    console.log("loginSuccess function called");
    console.log(data);

    //redirect to dashboard/homepage
    // BUG: redirect lands at page where nothing is clickable
    goto('/')
    
    
  }

</script>

<section id="body" class="">
  <div class="flex items-center p-6 bg-gray-50 dark:bg-gray-900">
    <div
      class="flex-1 max-w-xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
    >
      <div class="flex flex-col overflow-y-auto ">
        <div class="flex items-center justify-center p-6 sm:p-12">
          <div class="w-full">
            <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
              Login
            </h1>
            <div class="grid xl:grid-cols-1 xl:gap-6">
              <Input id="employeeId" name="employeeId" label="Employee Id" on:dispatch={getEmployeeId} >
                <slot>{employeeIdError}</slot>  
              </Input>
              <Input id="password" name="password" label="Password" type="password" on:dispatch={getPassword} >
                <slot>{passwordError}</slot>
              </Input>
            </div>
            
            <div class="pt-3">
              <p class="text-xl text-red-600">{postError}</p>
            </div>

            <button
              class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              on:click={submitLogin}
          >
            Login
            <!-- {#if loading} -->
            <!-- <svg class="animate-spin h-2 w-2 mr-3 white..." viewBox="0 0 24 24">
            </svg> -->
            <!-- {/if} -->
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</section>
