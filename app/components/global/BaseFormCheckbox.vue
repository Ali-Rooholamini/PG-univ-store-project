<script setup>
const props = defineProps({
    label: { type: String, required: false },
    disabled: {
        type: Boolean,
        default: false,
    },
});
const model = defineModel({
    type: Boolean,
    default: false,
});
</script>

<template>
    <div class="items-center flex gap-x-2">
        <slot>
            <p class="text-sm text-black">
                {{ props.label }}
            </p>
        </slot>
        <label
            class="relative inline-flex items-center justify-center w-10 h-5 rounded-full cursor-pointer"
            :class="{ 'cursor-not-allowed opacity-70': props.disabled }"
            v-bind="$attrs"
        >
            <Transition name="fade">
                <div
                    v-if="model"
                    class="absolute inset-0 bg-gradient-to-r from-primary to-darker-primary rounded-full"
                    :class="{ 'cursor-not-allowed': props.disabled }"
                />
                <div
                    v-else
                    class="absolute inset-0 bg-gray-3 rounded-full"
                    :class="{ 'cursor-not-allowed': props.disabled }"
                />
            </Transition>

            <input
                v-model="model"
                class="sr-only"
                type="checkbox"
                :disabled="props.disabled"
            >

            <span
                class="absolute bg-white left-0.5 top-0.5 w-4 h-4 rounded-full shadow-md transform transition-transform ease-in-out duration-300"
                :class="{
                    'translate-x-5': model,
                    'cursor-not-allowed': props.disabled,
                }"
            />
        </label>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
