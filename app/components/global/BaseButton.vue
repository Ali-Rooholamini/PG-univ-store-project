<script setup>
defineProps({
    isLoading: {
        type: Boolean,
        required: false,
        default: false,
    },
});
</script>

<template>
    <button class="btn !rounded-2xl gap-x-2">
        <slot v-if="isLoading" name="loading">
            <span class="loading loading-spinner loading-md" />
        </slot>
        <slot v-else />
    </button>
</template>
