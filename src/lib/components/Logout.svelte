<script>
	import { goto } from "$app/navigation";

    function logout() {
        fetch('https://dairies-rest-api.herokuapp.com/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                goto('/auth/login')
            })
            .catch((error) => {
                console.error('Error:', error);
                console.log("Error logging out!");
            });
    }
</script>

<li on:click={logout} class="flex">
    <div
        class="cursor-pointer inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
    >
        <svg
            class="w-4 h-4 mr-3"
            aria-hidden="true"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
        </svg>
        <span>Log out</span>
    </div>
</li>

<style>

</style>