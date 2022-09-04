<script lang="ts">
    let claim = [
        {}
    ]

</script>

<svelte:head>
	<title>Claim Management</title>
</svelte:head>

<main class="h-full overflow-y-auto">
    <div class="container px-6 mx-auto grid">
      <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Claim Management</h2>
      <div class= "px-4 py-3 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div class="grid gap-15 mb-10 grid-cols-2">

         <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"> 
            <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
           <!--Status-->
				<div>
					<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400 px-8 py-3">STATUS</p>	
				</div>
            <!--ClaimID-->
				<div>
					<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400 px-8 py-3">CLAIM ID</p>	
				</div>
            <!--Date-->
				<div>
					<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400 px-8 py-3">DATE</p>	
				</div>
         </div>        
         <div class="flex items-center justify-between p-2 mb-8 text-sm font-semibold bg-yellow-600 rounded-lg">
                <!--Second Box-->
                <div class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                        <!--Status-->
                             <div>
                                 <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400 px-10 py-3">STATUS</p>
                                 <p class="px-8 py-3 text-sm text-green-400 ">SUCCESS</p>	
                             </div>
                         <!--ClaimID-->
                             <div>
                                 <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400 px-10 py-3">CLAIM ID</p>
                                 <p class="px-8 py-3 text-sm">12345678</p>		
                             </div>
                         <!--Version-->
                             <div>
                                 <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400 px-10 py-3">VERSION</p>
                                 <p class="px-16 py-3 text-sm">1</p>	
                             </div>
                         <!--DATE-->
                             <div>
                                 <p class="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400 px-10 py-3">DATE</p>	
                                 <p class="px-4 py-3 text-sm">01/01/2022</p>
                             </div>
                         <!--CID-->
                             <div>
                                <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400 px-4 py-3">CID</p>
                                <p class="px-3 py-3 text-sm">SUCCESS</p>	
                            </div>
                    </div>
                        
                </div>
                
			
        </div>              
        </div>
      </div>
    </div> 
    
<!--New Status-->
<div class="container px-6 mx-auto grid">
    

</div>
</main>