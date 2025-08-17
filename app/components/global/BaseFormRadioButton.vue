<script setup>
const props = defineProps({
    value: { type: [String, Boolean], required: true },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined, required: false },
    label: { type: String, required: false },
});

const model = defineModel({
    type: [String, Number, Boolean, null],
    default: false,
});

const isChecked = computed(() => model.value === props.value);
</script>

<template>
    <label
        class="relative inline-flex items-center gap-2 cursor-pointer select-none"
        :class="{ 'opacity-50 cursor-not-allowed': disabled }"
        role="radio"
    >
        <slot name="label">
            <span class="text-sm">{{ label }}</span>
        </slot>

        <div
            class="relative w-5 h-5 rounded-full border-2 transition-all duration-300 ease-in-out"
            :class="[isChecked ? 'border-primary' : 'border-gray-2']"
        >
            <Transition name="scale-fade">
                <div
                    v-if="isChecked"
                    class="absolute inset-[3px] bg-primary rounded-full transition-all duration-300 ease-in-out"
                />
            </Transition>
        </div>

        <input
            v-model="model"
            :disabled="disabled"
            :name="name"
            :value="value"
            class="sr-only"
            type="radio"
        >
    </label>
</template>

<style scoped>
.scale-fade-enter-active,
.scale-fade-leave-active {
    transition:
        transform 0.3s ease-in-out,
        opacity 0.3s ease-in-out;
}

.scale-fade-enter-from,
.scale-fade-leave-to {
    transform: scale(0);
    opacity: 0;
}
</style>
