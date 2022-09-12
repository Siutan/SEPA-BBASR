<script lang="ts">
  import { onMount } from "svelte";
  import Switch from "../../../lib/components/Switch.svelte";
  import StatusCircle from "../../../lib/components/StatusCircle.svelte";

  function getClaims() {
    fetch('https://dairies-rest-api.herokuapp.com/claims', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(response => {
        console.log(response.status);
      })
  }

  // function to change 2022-09-03T10:09:01.225Z to 03-09-2022
  function formatDate(date) {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }

  const claims = [
    {
      "_id": "162_2",
      "claimID": "162_2",
      "membershipId": "162",
      "currentCID": {
        "cid": "bafybeibjftukhkg3ahdqmxe66m76ccjg5suwazh37h7ep36ioplq7ddnba",
        "_id": "63132a331f2411102c35d30a",
        "updatedAt": "2022-09-03T10:19:31.055Z",
        "createdAt": "2022-09-03T10:19:31.055Z"
      },
      "status": "success",
      "version": 3,
      "jsonLink": "bafybeibjftukhkg3ahdqmxe66m76ccjg5suwazh37h7ep36ioplq7ddnba.ipfs.w3s.link/162_Louie_Theroux_claimInfo.json",
      "imageLink": "bafybeibjftukhkg3ahdqmxe66m76ccjg5suwazh37h7ep36ioplq7ddnba.ipfs.w3s.link/162_Louie_Theroux_image.jpg",
      "active": true,
      "pastCIDs": [
        {
          "cid": "bafybeihdvap5k3ozlsebaylajawkpjfgpkefs5n74winsoo7tjfap2jwge",
          "_id": "631327bd1f2411102c35d2ed",
          "updatedAt": "2022-09-03T10:11:34.957Z",
          "createdAt": "2022-09-03T10:11:34.957Z"
        },
        {
          "cid": "bafybeigtbnn5a6luclexk5iswwsfnuqn7gsvsehkzc6t45vnr63tjpwfce",
          "_id": "631328561f2411102c35d2ff",
          "updatedAt": "2022-09-03T10:19:31.055Z",
          "createdAt": "2022-09-03T10:19:31.055Z"
        }
      ],
      "createdAt": "2022-09-03T10:09:01.225Z",
      "updatedAt": "2022-09-03T10:49:45.354Z",
      "__v": 0
    },
    {
      "_id": "162_1",
      "claimID": "162_1",
      "membershipId": "162",
      "currentCID": {
        "cid": "bafybeicbv2ujs6p53y7kspg4colud7um6ac3hku5upp7s3pus7rcwdlt3m",
        "_id": "6313275f1f2411102c35d2d3",
        "createdAt": "2022-09-03T10:07:27.356Z",
        "updatedAt": "2022-09-03T10:07:27.356Z"
      },
      "status": "pending",
      "version": 1,
      "jsonLink": "bafybeicbv2ujs6p53y7kspg4colud7um6ac3hku5upp7s3pus7rcwdlt3m.ipfs.w3s.link/162_Louie_Theroux_claimInfo.json",
      "imageLink": "bafybeicbv2ujs6p53y7kspg4colud7um6ac3hku5upp7s3pus7rcwdlt3m.ipfs.w3s.link/162_Louie_Theroux_image.jpg",
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-09-03T10:07:27.357Z",
      "updatedAt": "2022-09-03T10:42:46.401Z",
      "__v": 0
    },
    {
      "_id": "135_1",
      "claimID": "135_1",
      "membershipId": "135",
      "currentCID": {
        "cid": "bafybeih3c3qp6wuzsn2d7jdlnvyiwxaak2y3vxzciaatxzmk6cpbphcaym",
        "_id": "63103d45dea4e41c4b498cf0",
        "createdAt": "2022-09-01T05:04:05.773Z",
        "updatedAt": "2022-09-01T05:04:05.773Z"
      },
      "status": "success",
      "version": 1,
      "jsonLink": "bafybeih3c3qp6wuzsn2d7jdlnvyiwxaak2y3vxzciaatxzmk6cpbphcaym.ipfs.w3s.link/135_Likitung_Jinx_claimInfo.json",
      "imageLink": "bafybeih3c3qp6wuzsn2d7jdlnvyiwxaak2y3vxzciaatxzmk6cpbphcaym.ipfs.w3s.link/135_Likitung_Jinx_image.jpg",
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-09-01T05:04:05.774Z",
      "updatedAt": "2022-09-03T10:06:03.513Z",
      "__v": 0
    },
    {
      "_id": "121_1",
      "claimID": "121_1",
      "membershipId": "121",
      "currentCID": {
        "cid": "bafybeidp4yrugewyy4q2vbnvtzmt23v6ey4d6lv3iqg24rj3wclclmhiwy",
        "_id": "631039d81db4d7b9076baffd",
        "createdAt": "2022-09-01T04:49:29.074Z",
        "updatedAt": "2022-09-01T04:49:29.074Z"
      },
      "status": "pending",
      "version": 1,
      "jsonLink": "bafybeidp4yrugewyy4q2vbnvtzmt23v6ey4d6lv3iqg24rj3wclclmhiwy.ipfs.w3s.link/121_Charmander_Golem_claimInfo.json",
      "imageLink": "bafybeidp4yrugewyy4q2vbnvtzmt23v6ey4d6lv3iqg24rj3wclclmhiwy.ipfs.w3s.link/121_Charmander_Golem_image.jpg",
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-09-01T04:49:29.074Z",
      "updatedAt": "2022-09-01T04:49:29.074Z",
      "__v": 0
    },
    {
      "_id": "101_1",
      "claimID": "101_1",
      "membershipId": "101",
      "currentCID": {
        "cid": "bafybeifekugf2iilpyg6dzvsfp5punng2dthdoxxgxhqnlxnmtfe63keaa",
        "_id": "6310145cdc6a2ac5312468d0",
        "createdAt": "2022-09-01T02:09:32.352Z",
        "updatedAt": "2022-09-01T02:09:32.352Z"
      },
      "status": "success",
      "version": 1,
      "jsonLink": "bafybeifekugf2iilpyg6dzvsfp5punng2dthdoxxgxhqnlxnmtfe63keaa.ipfs.w3s.link/101_Lisa_Leslie_claimInfo.json",
      "imageLink": "bafybeifekugf2iilpyg6dzvsfp5punng2dthdoxxgxhqnlxnmtfe63keaa.ipfs.w3s.link/101_Lisa_Leslie_image.jpg",
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-09-01T02:09:32.353Z",
      "updatedAt": "2022-09-01T02:10:49.024Z",
      "__v": 0
    },
    {
      "_id": "92_1",
      "claimID": "92_1",
      "membershipId": "92",
      "currentCID": {
        "cid": "bafybeian76v7tpwkbwy3t2ss62gmvdkuutakx4ydfpseuz6v5wo6rmh6hu",
        "_id": "631012abdc6a2ac53124683c",
        "createdAt": "2022-09-01T02:02:19.653Z",
        "updatedAt": "2022-09-01T02:02:19.653Z"
      },
      "status": "success",
      "version": 1,
      "jsonLink": "bafybeian76v7tpwkbwy3t2ss62gmvdkuutakx4ydfpseuz6v5wo6rmh6hu.ipfs.w3s.link/92_Phillipa_Harmonic_claimInfo.json",
      "imageLink": "bafybeian76v7tpwkbwy3t2ss62gmvdkuutakx4ydfpseuz6v5wo6rmh6hu.ipfs.w3s.link/92_Phillipa_Harmonic_image.jpg",
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-09-01T02:02:19.653Z",
      "updatedAt": "2022-09-01T02:04:28.500Z",
      "__v": 0
    },
    {
      "_id": "85_1",
      "claimID": "85_1",
      "membershipId": "85",
      "currentCID": {
        "cid": "bafybeicrkyxkyzsye7rafcrtrqd3euumdhs52guydboa42f354hhstnszy",
        "_id": "630eef71dc6a2ac5312467a8",
        "createdAt": "2022-08-31T05:19:45.514Z",
        "updatedAt": "2022-08-31T05:19:45.514Z"
      },
      "status": "success",
      "version": 1,
      "jsonLink": "bafybeicrkyxkyzsye7rafcrtrqd3euumdhs52guydboa42f354hhstnszy.ipfs.w3s.link/85_Mike_Wezowski_claimInfo.json",
      "imageLink": "bafybeicrkyxkyzsye7rafcrtrqd3euumdhs52guydboa42f354hhstnszy.ipfs.w3s.link/85_Mike_Wezowski_image.jpg",
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-08-31T05:19:45.514Z",
      "updatedAt": "2022-08-31T05:23:37.653Z",
      "__v": 0
    },
    {
      "_id": "70_1",
      "claimID": "70_1",
      "membershipId": "70",
      "currentCID": {
        "cid": "bafybeiam6zxz3aovvplm2zcamtvdjqlcxuvqxtpyjyzaqltadnjohq6kli",
        "_id": "630eee25dc6a2ac531246714",
        "createdAt": "2022-08-31T05:14:13.168Z",
        "updatedAt": "2022-08-31T05:14:13.168Z"
      },
      "status": "success",
      "version": 1,
      "jsonLink": "bafybeiam6zxz3aovvplm2zcamtvdjqlcxuvqxtpyjyzaqltadnjohq6kli.ipfs.w3s.link/70_Lily_Pad_claimInfo.json",
      "imageLink": "bafybeiam6zxz3aovvplm2zcamtvdjqlcxuvqxtpyjyzaqltadnjohq6kli.ipfs.w3s.link/70_Lily_Pad_image.jpg",
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-08-31T05:14:13.168Z",
      "updatedAt": "2022-08-31T05:14:51.751Z",
      "__v": 0
    },
    {
      "_id": "62_1",
      "claimID": "62_1",
      "membershipId": "62",
      "currentCID": {
        "cid": "bafybeie372yjombfmsk22ekdrktfmokx7j6xnnaepm7lkj2gndpp4prjwy",
        "_id": "630eeb46dc6a2ac5312466e6",
        "createdAt": "2022-08-31T05:01:58.896Z",
        "updatedAt": "2022-08-31T05:01:58.896Z"
      },
      "status": "pending",
      "version": 1,
      "jsonLink": "bafybeie372yjombfmsk22ekdrktfmokx7j6xnnaepm7lkj2gndpp4prjwy.ipfs.w3s.link/62_Free_Willy_claimInfo.json",
      "imageLink": "bafybeie372yjombfmsk22ekdrktfmokx7j6xnnaepm7lkj2gndpp4prjwy.ipfs.w3s.link/62_Free_Willy_image.jpg",
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-08-31T05:01:58.896Z",
      "updatedAt": "2022-08-31T05:01:58.896Z",
      "__v": 0
    },
    {
      "_id": "58_1",
      "claimID": "58_1",
      "membershipId": "58",
      "currentCID": {
        "cid": "bafybeigxgtpy3f2zueba7drjokc3ken4h3f76zvzulj3ffzp6ln6xahiui",
        "_id": "630ee7d0dc6a2ac531246629",
        "createdAt": "2022-08-31T04:47:13.045Z",
        "updatedAt": "2022-08-31T04:47:13.045Z"
      },
      "status": "success",
      "version": 1,
      "jsonLink": "bafybeigxgtpy3f2zueba7drjokc3ken4h3f76zvzulj3ffzp6ln6xahiui.ipfs.w3s.link/58_Violet_Krumble_claimInfo.json",
      "imageLink": "bafybeigxgtpy3f2zueba7drjokc3ken4h3f76zvzulj3ffzp6ln6xahiui.ipfs.w3s.link/58_Violet_Krumble_image.jpg",
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-08-31T04:47:13.049Z",
      "updatedAt": "2022-08-31T04:47:38.460Z",
      "__v": 0
    },
    {
      "_id": "44_1",
      "claimID": "44_1",
      "membershipId": "44",
      "currentCID": {
        "cid": "bafybeigxprq6tqc6kmqskazdvuenieh5zazywvzys7nn2ujca2uvujrweu",
        "_id": "630cc9ba8e78a8a72213c718",
        "updatedAt": "2022-08-29T14:14:18.090Z",
        "createdAt": "2022-08-29T14:14:18.090Z"
      },
      "status": "pending",
      "version": 4,
      "jsonLink": "bafybeigxprq6tqc6kmqskazdvuenieh5zazywvzys7nn2ujca2uvujrweu.ipfs.w3s.link/44_TheRed_Skull_claimInfo.json",
      "imageLink": "bafybeigxprq6tqc6kmqskazdvuenieh5zazywvzys7nn2ujca2uvujrweu.ipfs.w3s.link/44_TheRed_Skull_image.jpg",
      "active": true,
      "pastCIDs": [
        {
          "cid": "bafybeiae7qkymghayrg6sn5qqcfip4m45q7px3yvitodd5zu6mgjqtonim",
          "_id": "630cc456a55226ce858bd1c4",
          "updatedAt": "2022-08-29T14:01:34.023Z",
          "createdAt": "2022-08-29T14:01:34.023Z"
        },
        {
          "cid": "bafybeihfy724q6ny4xi77h6dln55vfzbl6mu4m3kfjbbt3utaerurobqqe",
          "_id": "630cc6be84323828d1af63b2",
          "updatedAt": "2022-08-29T14:08:47.506Z",
          "createdAt": "2022-08-29T14:08:47.506Z"
        },
        {
          "cid": "bafybeiabybsdm57xnklovakjvhfp6vvrm4vc4ki4kntwladquelhb4g4g4",
          "_id": "630cc86f84323828d1af63c0",
          "updatedAt": "2022-08-29T14:14:18.090Z",
          "createdAt": "2022-08-29T14:14:18.090Z"
        }
      ],
      "createdAt": "2022-08-29T13:51:18.393Z",
      "updatedAt": "2022-08-29T14:14:18.090Z",
      "__v": 0
    },
    {
      "imageLink": "No Image",
      "_id": "30_1",
      "claimID": "30_1",
      "membershipId": "30",
      "currentCID": {
        "cid": "bafybeidlopogj4fjgp2cknxiuz5p6ubhkcyu4zihyib5kyv5xdddyzt4wi",
        "_id": "630cc0c598fa0af2dd9a5d6a",
        "createdAt": "2022-08-29T13:36:05.746Z",
        "updatedAt": "2022-08-29T13:36:05.746Z"
      },
      "status": "pending",
      "version": 1,
      "links": {
        "json": "bafybeidlopogj4fjgp2cknxiuz5p6ubhkcyu4zihyib5kyv5xdddyzt4wi.ipfs.w3s.link/30_Adriana_Dee_claimInfo.json",
        "image": "bafybeidlopogj4fjgp2cknxiuz5p6ubhkcyu4zihyib5kyv5xdddyzt4wi.ipfs.w3s.link/30_Adriana_Dee_image.jpg",
        "_id": "630cc0c598fa0af2dd9a5d6b",
        "createdAt": "2022-08-29T13:36:05.747Z",
        "updatedAt": "2022-08-29T13:36:05.747Z"
      },
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-08-29T13:36:05.749Z",
      "updatedAt": "2022-08-29T13:36:05.749Z",
      "__v": 0
    },
    {
      "imageLink": "No Image",
      "_id": "29_1",
      "claimID": "29_1",
      "membershipId": "29",
      "currentCID": {
        "cid": "bafybeidhoyjqzdrc5srayhc7sgkqru23pae3afujqqv3utl4m5vbs4jq5m",
        "_id": "630cbf845230fdcaad384a33",
        "createdAt": "2022-08-29T13:30:44.381Z",
        "updatedAt": "2022-08-29T13:30:44.381Z"
      },
      "status": "pending",
      "version": 1,
      "links": {
        "json": "bafybeidhoyjqzdrc5srayhc7sgkqru23pae3afujqqv3utl4m5vbs4jq5m.ipfs.w3s.link/29_Pele_Football_claimInfo.json",
        "image": "bafybeidhoyjqzdrc5srayhc7sgkqru23pae3afujqqv3utl4m5vbs4jq5m.ipfs.w3s.link/29_Pele_Football_image.jpg",
        "_id": "630cbf845230fdcaad384a34",
        "createdAt": "2022-08-29T13:30:44.382Z",
        "updatedAt": "2022-08-29T13:30:44.382Z"
      },
      "active": true,
      "pastCIDs": [],
      "createdAt": "2022-08-29T13:30:44.387Z",
      "updatedAt": "2022-08-29T13:30:44.387Z",
      "__v": 0
    }
  ];

  let selectedClaim = claims[0];

  // truncate cid to 7 characters
  const truncateCID = (cid) => {
    return cid.slice(0, 10) + '...';
  };

  // copy the cid to clipboard if clicked
  const copyCID = (cid) => {
    navigator.clipboard.writeText(cid);
    alert('CID copied to clipboard');
  };

</script>

<svelte:head>
  <title>Manage claims</title>
</svelte:head>

<main class="h-full pb-16 overflow-y-auto">
  <div class="container px-6 mx-auto grid">
    <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Manage Claims</h2>
    <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div class="grid grid-flow-row-dense grid-cols-3 grid-rows-3 gap-2">
        <!-- Claim column -->
        <div class="row-span-2 flex flex-col p-1">
          <div class="flex flex-row space-x-10 pl-3">
            <div>Status</div>
            <div>ClaimID</div>
            <div>Date</div>
          </div>
          <div>
            {#each claims as claim}
              <div
                class="border-2 rounded-lg p-3 m-2 flex flex-row space-x-14 hover:bg-purple-700 hover:text-white cursor-pointer"
                on:click={() => {
                selectedClaim = claim;
              }}
              >
                <div><StatusCircle status={claim.status}/></div>
                <div>{claim.claimID}</div>
                <div>{formatDate(claim.createdAt)}</div>
              </div>
            {/each}
          </div>
        </div>
        <!-- Claim details -->
        <div class="row-span-2 col-span-2 flex flex-col border-2 rounded-lg dark:bg-gray-900 p-1">
          <div>
            <div class="grid gap-x-8 gap-y-4 grid-cols-5 text-center border-b-2 overflow-hidden place-items-center pb-4 ">
              <div>Status</div>
              <div>Claim ID</div>
              <div>Version</div>
              <div>Date</div>
              <div>CID</div>
              <div class=""><StatusCircle status={selectedClaim.status}/></div>
              <div>{selectedClaim.claimID}</div>
              <div>{selectedClaim.version}</div>
              <div>{formatDate(selectedClaim.createdAt)}</div>
              <div
                class="hover:cursor-pointer"
                on:click = {() => copyCID(selectedClaim.currentCID.cid)}
              >{truncateCID(selectedClaim.currentCID.cid)}</div>
            </div>
            <div>
              <p class="text-center font-semibold text-yellow-400 dark:text-yellow-300 m-4">⚠️This is sensitive information.
                Access will be monitored</p>
            </div>
          </div>
          <div>
            <div class="grid gap-x-2 gap-y-4 grid-cols-2 text-center">
              <!-- Customer Info -->
              <div class="rounded-lg p-2 ml-2 mb-2  bg-gray-100 dark:bg-gray-800">
                <p class="font-semibold text-xl p-2">Policy Holder Details</p>
                <div id="customerForm" class="p-5 flex flex-col flex-wrap gap-5">
                  <div class="grid xl:grid-cols-2 xl:gap-6">
                    <div class="relative z-0 w-full mb-6 group">
                      <input
                        disabled
                        type="text"
                        name="givenName"
                        id="floating_first_name"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                      />
                      <label
                        for="floating_first_name"
                        class="absolute text-sm text-purple-900 dark:text-gray-400 left-0 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >First name of Insured</label
                      >
                    </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <input
                        disabled
                        type="text"
                        name="lastName"
                        id="floating_last_name"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
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
                        disabled
                        type="tel"
                        name="phone"
                        id="floating_phone"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                      />
                      <label
                        for="floating_phone"
                        class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Phone number</label
                      >
                    </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <input
                        disabled
                        type="text"
                        name="dob"
                        id="floating_date"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
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
                      disabled
                      type="email"
                      name="emailAddress"
                      id="floating_email"
                      class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                      placeholder=" "
                    />
                    <label
                      for="floating_email"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                    >Email address</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      disabled
                      type="text"
                      name="address"
                      id="floating_address"
                      class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                      placeholder=" "
                    />
                    <label
                      for="floating_address"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                    >Address</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      disabled
                      type="text"
                      name="membershipId"
                      id="floating_memberID"
                      class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                      placeholder=" "
                    />
                    <label
                      for="floating_memberID"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                    >Policy Number (XX000000)</label
                    >
                    <div class="relative z-0 my-10 w-full mb-6 group">
                      <select
                        name="lastRider"
                        id="floating_last_rider"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                      >
                        <option disabled value="" class="text-gray-600">Select</option>
                      </select>
                      <label
                        for="floating_last_rider"
                        class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Was the policy holder the last person to use the vehicle?</label
                      >
                    </div>
                  </div>
                </div>
              </div>
              <!-- Vehicle Info -->
              <div class="rounded-lg p-2 mr-2 mb-2 bg-gray-100 dark:bg-gray-800">
                <p class="font-semibold text-xl p-2">Vehicle details</p>
                <div id="vehicleForm" class="p-5 flex flex-col flex-wrap gap-5">
                  <div class="grid xl:grid-cols-2 xl:gap-6">
                    <div class="relative z-0 w-full mb-6 group">
                      <input
                        disabled
                        type="text"
                        name="vRego"
                        id="floating_registration"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                      />
                      <label
                        for="floating_registration"
                        class="absolute text-sm text-purple-900 dark:text-gray-400 left-0 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Rego number</label
                      >
                    </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <input
                        disabled
                        type="text"
                        name="vEngine"
                        id="floating_engine"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
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
                        disabled
                        type="text"
                        name="vMake"
                        id="floating_make"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
                      />
                      <label
                        for="floating_make"
                        class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                      >Vehicle Make</label
                      >
                    </div>
                    <div class="relative z-0 w-full mb-6 group">
                      <input
                        disabled
                        type="text"
                        name="vYear"
                        id="floating_year"
                        class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                        placeholder=" "
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
                      disabled
                      type="text"
                      name="model"
                      id="floating_model"
                      class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                      placeholder=" "
                    />
                    <label
                      for="floating_model"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                    >Vehicle Model</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      disabled
                      type="text"
                      name="VIN"
                      id="floating_vin"
                      class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                      placeholder=" "
                    />
                    <label
                      for="floating_vin"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                    >VIN</label
                    >
                  </div>
                  <div class="relative z-0 w-full mb-6 group">
                    <input
                      disabled
                      type="text"
                      name="vGeneration"
                      id="floating_generation"
                      class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                      placeholder=" "
                    />
                    <label
                      for="floating_generation"
                      class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                    >Vehicle Generation</label
                    >
                    <div class="relative z-0 my-10 w-full mb-6 group">
                      <div class="relative z-0 w-full mb-6 group">
                        <input
                          disabled
                          type="text"
                          name="color"
                          id="floating_color"
                          class="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:border-purple-100 outline-none ring-0 border-purple-900 peer"
                          placeholder=" "
                        />
                        <label
                          for="floating_color"
                          class="absolute text-sm text-gray-500 dark:text-gray-400 left-0 text-purple-900 dark:text-purple-100 scale-100 translate-y-0 scale-75 -translate-y-14"
                        >Vehicle Color</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <!-- Driver History -->
            <div class="rounded-lg p-2 ml-2 mb-2  bg-gray-100 dark:bg-gray-800">
              <p class="font-semibold text-xl p-2">Driver History</p>
              <div class="flex flex-col space-y-3 p-2">
                <p class="font-medium text-lg">In the past 5 years, has the driver:</p>
                <Switch
                  design="inner"
                  label="Been involved in a motor vehicle accident?"
                />
                <Switch
                  design="inner"
                  label="Been convicted of a driving offence?"
                />
                <Switch
                  design="inner"
                  label="Been disqualified for driving or had their licence cancelled/suspended?"
                />
                <Switch
                  design="inner"
                  label="Been refused vehicle insurance or had their policy cancelled?"
                />
              </div>
            </div>
            <div>
              <!-- Vehicle Images -->
              <div class="rounded-lg p-2 ml-2 mb-2  bg-gray-100 dark:bg-gray-800">
                <p class="font-semibold text-xl p-2">Vehicle Images</p>
                <div class="flex flex-col space-y-3 p-2">
                  Insert Image Here
                </div>
              </div>
            </div>
          </div>
          <!--            <div class="flex flex-row space-x-3">-->
          <!--              <div>{selectedClaim.id}</div>-->
          <!--              <div>{selectedClaim.name}</div>-->
          <!--              <div>{selectedClaim.description}</div>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</main>
