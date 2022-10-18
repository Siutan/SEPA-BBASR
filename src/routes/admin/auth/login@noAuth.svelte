<script lang="ts">
  import Input from "../../../lib/components/Input.svelte";
  import Header2 from "$src/lib/templates/Admin/Header2.svelte"
  import { goto } from "$app/navigation";


  let employeeId = "";
  let employeeIdError = "";
  let password = "";
  let passwordError = "";
  let postError = "";
  let showPassword = false;
  let buttonText = "Login";

  const toggle = () => {
    showPassword = !showPassword;
    let inputType;
    if (showPassword) {
      inputType = "text";
    } else {
      inputType = "password";
    }
    let input = document.getElementById(`password`);
    input.type = inputType;
  };



  //get email input, dispatched from the child 'Input' component
  const getEmployeeId = (e) => {
    employeeId = e.detail;
  }

  //function called when login button is clicked 
  function submitLogin(){
    // clear any error from previous login attempt
    postError = "";
   
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
            buttonText = "Login"
          }
          else{

            //call redirect function
            loginSuccess(data);
          }

        })
        .catch((error) => {

          postError = `Error Logging in with credentials`;
          buttonText = "Login"

      });
    }  
    
  }
  const isEmpty = (str) => {
    return (!str || 0 === str.length);
  }

  function validInputs(){
    console.log("valid inputs called");
    console.log(`password ${password.length}`);
    console.log(`password ${!password}`);
    if (isEmpty(employeeId)) {
      employeeIdError = "Employee ID is required";
     
    }
    else{
      employeeIdError = "";
    }
    if (isEmpty(password)) {
      
      passwordError = "Password is required";
      
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
       
    //redirect to dashboard/homepage
    // BUG: redirect lands at page where nothing is clickable
    goto('/')
  }

</script>
<Header2 />
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
                    
                    <div class="absolute inset-y-3 right-0 items-center px-2">
                      {#if showPassword === true}
                        <svg on:click={toggle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                              stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      {:else}
                        <svg on:click={toggle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                              stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      {/if}
                    </div>

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
                    >
                    Password

                    </label>

                    <div class="text-red-600 pt-3">
                      {passwordError}
                    </div>
                  
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

              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

</section>