<script setup>
function triggerClientError() {
  throw new Error("Nuxt Button Error");
}
</script>

<template>
  <div class="w-full">
    <div> test</div>
    <button class="w-full" id="errorBtn" @click="triggerClientError">
      Throw Client Error
    </button>
  </div>
</template>
