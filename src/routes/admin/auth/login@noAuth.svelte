<script lang="ts">
  import Input from "../../../lib/components/Input.svelte";
  import { goto } from "$app/navigation";


  let employeeId = "";
  let employeeIdError = "";
  let password = "";
  let passwordError = "";
  let postError = "";

  let buttonText = "Login";

  let loading = false;



  //get email input, dispatched from the child 'Input' component
  const getEmployeeId = (e) => {
    employeeId = e.detail;
  }

  //function called when login button is clicked 
  function submitLogin(){
    // clear any error from previous login attempt
    postError = "";

    //add loading icon
    loading = true;
    
    //check if inputs are valid
    if(validInputs()){
      buttonText = "Logging in...";

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
          
          loading = false;
          postError = `Error Logging in with credentials`;

      });
    }  
    
  }
  const isEmpty = (str) => {
    return (!str || 0 === str.length);
  }

  function validInputs(){
    if (isEmpty(employeeId)) {
      employeeIdError = "Employee ID is required";
      return false;
    }
    else{
      employeeIdError = "";
    }
    if (isEmpty(password)) {
      passwordError = "Password is required";
      return false;
    }
    else{
      passwordError = "";
    }

    //if no errors return true, otherwise return false
    return passwordError == "" && employeeIdError == "";


  }

  //if Login is a success store cookie and redirect them to logged in dashboard
  function loginSuccess(data){
    // store user id in cookie
    document.cookie = `employeeId=${data.employeeId}`;
    
    loading = false;


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
        <form
          on:submit|preventDefault={submitLogin}
        >
          <div class="flex items-center justify-center p-6 sm:p-12">
            <div class="w-full">
              <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              <div class="grid xl:grid-cols-1 xl:gap-6">
                <Input id="employeeId" name="employeeId" label="Employee Id" on:dispatch={getEmployeeId} >
                  <slot>{employeeIdError}</slot>
                </Input>

                <div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                      placeholder=" "
                      bind:value={password}
                    />
                    <label
                      for="password"
                      class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >Password</label
                    >
                    <slot>{passwordError}</slot>
                  </div>


                </div>
              </div>

              <div class="pt-3">
                <p class="text-xl text-red-600">{postError}</p>
              </div>

              <button
                type="submit"
                class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                on:click={submitLogin}
              >
                {buttonText}
                <!-- {#if loading} -->
                <!-- <svg class="animate-spin h-2 w-2 mr-3 white..." viewBox="0 0 24 24">
                </svg> -->
                <!-- {/if} -->
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

</section>
