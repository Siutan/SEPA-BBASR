<script>
  export let status = 'pending';
</script>

<div>
  {#if status === "success"}
    <div data-testid="success" class="w-8 h-8 rounded-full bg-green-600">
    </div>
  {:else if (status === "pending")}
    <div data-testid="pending" class="w-8 h-8 rounded-full bg-orange-400">
    </div>
  {:else}
    <div data-testid="failed" class="w-8 h-8 rounded-full bg-red-600">
    </div>
  {/if}
</div>