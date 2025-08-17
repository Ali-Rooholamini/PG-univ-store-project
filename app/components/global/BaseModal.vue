<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
});

defineEmits(["close"]);
</script>

<template>
    <teleport to="body">
        <dialog class="modal modal-bottom sm:modal-middle" :open="isOpen">
            <div
                v-bind="$attrs"
                class="modal-box px-4 py-6 !max-h-[calc(100dvh-59px)]"
            >
                <div
                    class="w-24 h-2 mx-auto rounded-full bg-gray-1"
                    @click="$emit('close')"
                />
                <div class="mt-6">
                    <slot />
                </div>
            </div>
            <div
                class="modal-backdrop bg-black/50 fixed inset-0 z-51"
                @click="$emit('close')"
            />
        </dialog>
    </teleport>
</template>
