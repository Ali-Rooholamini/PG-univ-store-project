<script setup>
function triggerClientError() {
    throw new Error("Nuxt Button Error");
}
</script>

<template>
    <div class="w-full">
        <div>test</div>
        <button class="w-full bg-primary" @click="triggerClientError">
            Throw Client Error
        </button>
    </div>
</template>
