<script lang="ts">
  import axios from "axios";

  // form data
  let givenName = "";
  let lastName = "";
  let email = "";
  let isAdmin;

  // error messages
  let fNameError = "";
  let lNameError = "";
  let idError = "";
  let emailError = "";
  let passwordError = "";
  let postSuccess = "";
  let postError = "";

  // loading message
  let buttonText = "Update Account";

  // get the employee id from userId cookie
  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )
  let employeeId = getCookieValue("employeeId");

  // do a get request to get the employee data
  const getEmployee = async () => {
    try {
      let employeeConfig = {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      }
      const response = await axios.get(`https://dairies-rest-api.herokuapp.com/user/${employeeId}`, employeeConfig);
      givenName = response.data.givenName;
      lastName = response.data.lastName;
      email = response.data.companyEmail;
      isAdmin = response.data.admin;
    } catch (error) {
      console.log(error);
    }
  }

  // axios call to register user
  function updateUser(config) {
    axios(config)
      .then(function (response) {
        postSuccess = "User successfully Updated";
        postError = "";
        // refresh page
        setTimeout(function () {
          location.reload();
        }, 2000);
      })
      .catch(function (error) {
        postError = "Error registering user";
        postSuccess = "";
      });
  }

  function validateName(type) {
    // check when user leaves input field
    if (type === "first") {
      if (givenName.length < 2) {
        fNameError = "First name must be at least 2 characters";
      } else {
        fNameError = "";
      }
    } else {
      if (lastName.length < 2) {
        lNameError = "Last name must be at least 2 characters";
      } else {
        lNameError = "";
      }
    }
    // check when submit button is clicked
    if (type === "submit") {
      if (givenName.length < 2) {
        fNameError = "First name must be at least 2 characters";
      } else {
        fNameError = "";
      }
      if (lastName.length < 2) {
        lNameError = "Last name must be at least 2 characters";
      } else {
        lNameError = "";
      }
    }
  }

  // validate Company Email, Password, and Confirm Password
  function validateEmail() {
    let emailExpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // switch case for email validation
    switch (true) {
      case email == "":
        emailError = "Email is required";
        break;
      case email.toLowerCase().match(emailExpression) == null:
        emailError = "Please enter a valid Email Address";
        break;
      case email.endsWith("dairies.com") == false:
        emailError = "Please enter a valid Company Email Address";
        break;
      default:
        emailError = "";
    }
  }

  // form submit function
  function submitForm() {
    validateName("submit");
    validateEmail();
    if (emailError === "" && passwordError === "") {
      // handle admin check like this for now, change it later
      if (isAdmin) {
        isAdmin = 1;
      } else {
        isAdmin = 0;
      }
      // axios config
      let updateConfig = {
        method: "post",
        url: "https://dairies-rest-api.herokuapp.com/user/update",
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
        data: {
          "employeeId": employeeId,
          "givenName": givenName,
          "lastName": lastName,
          "companyEmail": email,
          "admin": isAdmin
        }
      }
      buttonText = "Updating User...";
      updateUser(updateConfig);
    }
  }

</script>

{#await getEmployee()}
  <div>Loading...</div>
{:then data}
  <form
    on:submit|preventDefault={submitForm}
  >
    <section id="body" class="">
      <!-- Put this in class below if needed: min-h-screen -->
      <div class="flex flex-col overflow-y-auto ">
        <div class="flex items-center justify-center p-6 sm:p-12">
          <div class="w-full">
            <h1 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
              User Profile
            </h1>
            <div class="grid xl:grid-cols-2 xl:gap-6">
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="givenName"
                  id="floating_givenName"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  bind:value={givenName}
                  on:focusout={() => validateName("first")}
                />
                <label
                  for="floating_givenName"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >First Name</label
                >
                <div class="text-red-600 pt-3">
                  {fNameError}
                </div>
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="lastName"
                  id="floating_lastName"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                  placeholder=" "
                  bind:value={lastName}
                  on:focusout={() => validateName("last")}
                />
                <label
                  for="floating_lastName"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Last Name</label
                >
                <div class="text-red-600 pt-3">
                  {lNameError}
                </div>
              </div>
            </div>
            <div class="relative z-0 w-full mb-6">
              <input
                type="text"
                name="make"
                id="floating_email"
                class=" vehicle block py-2.5 px-0 text-sm w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                placeholder=" "
                bind:value={email}
                on:focusout={validateEmail}
              />
              <label
                for="floating_email"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >Company Email</label
              >
              <div class="text-red-600 pt-3">
                {emailError}
              </div>
            </div>
            <div class="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="make"
                id="floating_id"
                class=" vehicle block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                placeholder=" "
                bind:value={employeeId}
                disabled
              />
              <label
                for="floating_id"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >Employee ID</label
              >
              <div class="text-red-600 pt-3">
                {idError}
              </div>
            </div>
            <button
              type="submit"
              class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              on:click={submitForm}
            >
              {buttonText}
            </button>

            <div class="pt-3">
              <p class="text-xl text-green-600">{postSuccess}</p>
              <p class="text-xl text-red-600">{postError}</p>
            </div>
            <hr class="my-8" />
          </div>
        </div>
      </div>
    </section>
  </form>
{/await}
