<script setup>
import { isRequired } from "~/utils/formValidations.js";

const props = defineProps({
    hint: { type: String, default: "" },
    options: {
        type: Array,
        required: true,
    },
    placeholder: {
        type: String,
        required: false,
        default: "انتخاب کنید",
    },
    label: {
        type: String,
        required: false,
        default: undefined,
    },
    isRequired: { type: Boolean, default: false },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    isLoading: {
        type: Boolean,
        required: false,
        default: false,
    },
    valueKey: {
        type: [String, Number],
        required: false,
        default: "id",
    },
    labelKey: {
        type: [String, Number],
        required: false,
        default: "name",
    },
    searchable: { type: Boolean, default: false },
});

const modelValue = defineModel({
    type: [String, Number, null],
    default: null,
});

const isOpen = ref(false);

const searchQuery = ref("");
const {
    enableLoading: enableSearchLoading,
    disableLoading: disableSearchLoading,
    isLoading: isSearchLoading,
} = useLoading(false);

const localFilteredOptions = ref([]);

const debouncedFilter = useDebounceFn(() => {
    if (searchQuery.value.trim() === "") {
        localFilteredOptions.value = props.options;
    }
    else {
        localFilteredOptions.value = props.options.filter((option) => {
            const label = option[props.labelKey] || option;
            return (
                typeof label === "string"
                && label.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });
    }
    disableSearchLoading();
}, 500);

function searchInputHandler() {
    !isSearchLoading && enableSearchLoading();
    debouncedFilter();
}

const filteredOptions = computed(() => {
    return props.searchable ? localFilteredOptions.value : props.options;
});

watch(
    () => props.options,
    (newOptions) => {
        localFilteredOptions.value = newOptions;
    },
    { immediate: true, deep: true },
);

const selectedLabel = computed(() => {
    if (modelValue.value === null || modelValue.value === undefined) {
        return props.placeholder;
    }

    const selectedOption = props.options.find((option) => {
        const optionValue
            = option[props.valueKey] !== undefined
                ? option[props.valueKey]
                : option;
        return optionValue === modelValue.value;
    });

    if (selectedOption) {
        return selectedOption[props.labelKey] || selectedOption;
    }

    return props.placeholder;
});

const errorText = ref("");
function validate() {
    if (props.isRequired) {
        const validationResult = isRequired(modelValue.value);
        if (validationResult !== true) {
            errorText.value = validationResult;
        }
        else {
            errorText.value = "";
        }
    }
    else {
        errorText.value = "";
    }
    return errorText.value === "";
}

watch(modelValue, () => {
    if (!isOpen.value) {
        validate();
    }
});

const searchInputRef = ref(null);
function toggleDropdown() {
    if (!props.disabled) {
        isOpen.value = !isOpen.value;
        if (isOpen.value) {
            if (props.searchable && searchInputRef.value) {
                nextTick(() => searchInputRef.value.focus());
            }
        }
        else {
            validate();
        }
    }
}

function selectOption(option) {
    // todo: refactor select-box template to use <Select> and <option>
    modelValue.value = option[props.valueKey] || option;
    isOpen.value = false;
    validate();
    searchQuery.value = "";
}

const id = useId();
const inputRef = ref(null);

onClickOutside(inputRef, () => {
    if (isOpen.value) {
        isOpen.value = false;
        validate();
    }
});
</script>

<template>
    <div
        v-if="!isLoading"
        ref="inputRef"
        class="relative mx-2 mb-8"
        :class="{ 'mt-2': label }"
    >
        <label
            v-if="label"
            :for="id"
            class="text-xs absolute text-black/50 select-none pointer-events-none py-0 px-1 inline-block bg-white right-5 top-0 -translate-y-1/2 transition-colors z-10"
            :class="{ 'text-primary': isOpen, '!bg-white/70': disabled }"
        >
            {{ label }}
        </label>
        <div
            :class="{
                'error !outline-rose-500 !outline !outline-2 !outline-offset-[3px]':
                    !!errorText,
            }"
            :aria-expanded="isOpen"
            :aria-disabled="disabled"
            role="combobox"
            :tabindex="disabled ? -1 : 0"
            class="!h-12 cursor-pointer border-black border-opacity-10 bg-white rounded-2xl w-full flex justify-between items-center"
            @click="toggleDropdown"
        >
            <span class="text-sm text-black text-opacity-70 px-4">
                {{ selectedLabel }}
            </span>
            <span class="pr-4 pl-2 transition-transform duration-300">
                <SvgIcon
                    :name="isOpen ? 'arrow-up' : 'arrow-down'"
                    class="!w-4 !h-4"
                />
            </span>
        </div>
        <Transition mode="out-in" name="slide-fade">
            <div
                v-if="!isOpen && (errorText || hint)"
                class="mt-2 mx-1 min-h-4 text-xs absolute z-10"
            >
                <span
                    v-if="errorText"
                    :key="`error-${errorText}`"
                    class="inline-block font-medium text-xs text-error"
                >
                    {{ errorText }}
                </span>
                <span
                    v-else-if="hint"
                    key="hint"
                    class="inline-block text-xs text-black text-opacity-50"
                >
                    {{ hint }}
                </span>
            </div>
        </Transition>
        <div
            v-show="isOpen"
            class="absolute z-20 w-full mt-2 bg-white border border-gray-3 rounded-[15px] shadow-lg max-h-60 overflow-y-auto"
        >
            <div v-if="searchable" class="p-2 relative">
                <input
                    ref="searchInputRef"
                    v-model="searchQuery"
                    type="text"
                    class="w-full border outline-none bg-gray-3 rounded-[10px] placeholder:text-xs placeholder:text-[rgba(142, 142, 142, 1)] placeholder:font-medium py-3 px-4"
                    :placeholder="`جستجو ${label || 'دسته‌بندی'}`"
                    @input="searchInputHandler"
                >
                <span class="absolute left-5 top-6 text-black">
                    <SvgIcon
                        v-if="isSearchLoading"
                        name="search-status"
                        class="!w-4 !h-4"
                    />
                    <SvgIcon v-else name="search-normal" class="!w-4 !h-4" />
                </span>
            </div>
            <ul role="listbox" class="w-full mx-auto rounded-[15px] p-2">
                <li
                    v-for="(option, index) in filteredOptions"
                    :key="index"
                    class="py-4 text-sm hover:bg-gray-3 p-4 cursor-pointer rounded-[10px]"
                    :class="{
                        'bg-gray-2':
                            (option[props.valueKey] || option) === modelValue,
                    }"
                    role="option"
                    :aria-selected="
                        (option[props.valueKey] || option) === modelValue
                    "
                    @click="selectOption(option)"
                >
                    {{ option[props.labelKey] || option }}
                </li>
                <li
                    v-if="filteredOptions.length === 0"
                    class="p-4 text-sm text-gray-2"
                >
                    هیچ گزینه‌ای یافت نشد
                </li>
            </ul>
        </div>
    </div>
    <div
        v-else
        class="flex-[1_1_calc(50%-16px)] h-12 mx-1 mb-6"
        :class="{ 'mt-2': label }"
    >
        <div class="skeleton h-full rounded-2xl" />
    </div>
</template>

<style scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-5px);
    opacity: 0;
}

.overflow-y-auto::-webkit-scrollbar {
    display: none;
}

.overflow-y-auto {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
