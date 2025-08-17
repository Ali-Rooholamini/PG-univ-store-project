<script setup>
import {
    isNumber,
    isRequired,
    maxLength,
    minLength,
} from "~/utils/formValidations.js";

const props = defineProps({
    disabled: { type: Boolean, default: false },
    hint: { type: String, default: "" },
    label: { type: String, required: true },
    copyable: { type: Boolean, default: false },
    isPassword: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
    placeholder: { type: String, default: "" },
    isRequired: { type: Boolean, default: false },
    isNumber: { type: Boolean, default: false },
    minLength: { type: [Number, null], default: null },
    maxLength: { type: [Number, null], default: null },
    validateOn: { type: String, default: "input" },
    validation: { type: [Array, Function], default: () => [] },
    inputClass: { type: [String, Object, Array], default: "" },
    inputStyle: { type: [String, Object], default: "" },
    isCurrency: { type: Boolean, default: false },
    isLtr: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    autocomplete: { type: String, default: "off" },
});
const id = useId();
const { copy, copied } = useClipboard();

const modelValue = defineModel({
    type: String,
    required: true,
});

const data = reactive({
    isFocused: false,
    errorText: "",
    showPassword: false,
    prependWidth: 0,
    appendWidth: 0,
    isMountInput: false,
});
const inputTemplate = useTemplateRef("inputTemplate");
const inputContainer = useTemplateRef("inputContainer");
const prependRef = useTemplateRef("prependRef");
const appendRef = useTemplateRef("appendRef");

function formatCurrency(val, reverse = false) {
    return !reverse
        ? val.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : val.replace(/,/g, "");
}

function togglePassword() {
    data.showPassword = !data.showPassword;
    nextTick(() => {
        requestAnimationFrame(() => {
            const el = inputTemplate.value;
            if (!el)
                return;
            el.focus();
            el.setSelectionRange(
                modelValue.value.length,
                modelValue.value.length,
            );
        });
    });
}

const computeType = computed(() =>
    data.showPassword ? "text" : props.isPassword ? "password" : "text",
);

// 👇 Dynamic position label with slots
let prependObserver, appendObserver;

function updatePrependWidth() {
    if (prependRef.value) {
        data.prependWidth = prependRef.value.getBoundingClientRect().width;
    }
    else {
        data.prependWidth = 0;
    }
}

function updateAppendWidth() {
    if (appendRef.value) {
        data.appendWidth = appendRef.value.getBoundingClientRect().width;
    }
    else {
        data.appendWidth = 0;
    }
}

const labelStyle = computed(() => {
    const totalPadding = 12;
    const baseLeft = props.isLtr
        ? data.prependWidth + totalPadding
        : data.appendWidth + totalPadding;
    const baseRight = props.isLtr
        ? data.appendWidth + totalPadding
        : data.prependWidth + totalPadding;

    return {
        left: props.isLtr ? `${baseLeft}px` : "auto",
        right: props.isLtr ? "auto" : `${baseRight}px`,
        maxWidth: `calc(100% - ${baseLeft + baseRight}px)`,
    };
});

// 👇 Validations
const validationMapper = computed(() => ({
    isRequired,
    isNumber,
    minLength: val => minLength(val, props.minLength),
    maxLength: val => maxLength(val, props.maxLength),
}));
const arrayOfErrors = computed(() => {
    const propsValidations = [
        "isRequired",
        "isNumber",
        "minLength",
        "maxLength",
    ];
    const arrayChecker = [];
    Object.entries(props)
        .filter(([key, value]) => propsValidations.includes(key) && value)
        .forEach(([key]) => {
            arrayChecker.push(validationMapper.value[key](modelValue.value));
        });
    if (typeof props.validation === "function") {
        arrayChecker.push(props.validation(modelValue.value));
    }
    else if (props.validation.length) {
        props.validation.forEach((customValidation) => {
            arrayChecker.push(customValidation(modelValue.value));
        });
    }
    return arrayChecker;
});

function validate() {
    data.errorText
        = arrayOfErrors.value.find(
            validationResult => typeof validationResult === "string",
        ) || "";
}

useEventListener(
    inputTemplate,
    ["blur", "input", "change", "focus"].includes(props.validateOn)
        ? props.validateOn
        : "input",
    validate,
);

const computeInputClass = computed(() => ({
    "opacity-70 cursor-none": props.disabled,
    "error !outline-rose-500 !outline !outline-2 !outline-offset-[3px]":
        !!data.errorText,
}));

const modelValueFormatted = computed({
    get() {
        const raw = modelValue.value?.toString().replace(/\D/g, "") || "";
        return props.isCurrency ? formatCurrency(raw) : modelValue.value;
    },
    set(val) {
        const raw = props.isCurrency ? formatCurrency(val, true) : val;
        modelValue.value = raw;
    },
});

onClickOutside(inputContainer, () => (data.isFocused = false));

onMounted(() => {
    updatePrependWidth();
    updateAppendWidth();

    if (window.ResizeObserver) {
        prependObserver = new ResizeObserver(() => updatePrependWidth());
        appendObserver = new ResizeObserver(() => updateAppendWidth());
        if (prependRef.value)
            prependObserver.observe(prependRef.value);
        if (appendRef.value)
            appendObserver.observe(appendRef.value);
    }

    nextTick(() => {
        requestAnimationFrame(() => {
            data.isMountInput = true;
        });
    });
});
onBeforeUnmount(() => {
    if (prependObserver)
        prependObserver.disconnect();
    if (appendObserver)
        appendObserver.disconnect();
});
defineExpose({
    inputRef: inputTemplate,
});
</script>

<template>
    <div class="relative mx-1.5 mt-1">
        <template v-if="isLoading">
            <div class="min-h-50 input skeleton w-full" />
            <div class="mt-1 min-h-4" />
        </template>
        <template v-else>
            <div
                ref="inputContainer"
                :class="[computeInputClass, inputClass]"
                :style="inputStyle"
                class="input group flex min-h-12 py-2 items-center border-[1px] rounded-2xl border-cyan-950/10 bg-white relative"
            >
                <label
                    :class="{
                        'label-active': data.isFocused || modelValue,
                        '!text-teal-500': data.isFocused,
                        'transition-all ease-in-out duration-400':
                            data.isMountInput,
                    }"
                    :dir="isLtr ? 'ltr' : 'rtl'"
                    :for="id"
                    :style="labelStyle"
                    class="floating-label absolute pointer-events-none truncate"
                >
                    {{ label }}
                </label>

                <div
                    v-if="'prepend' in $slots"
                    ref="prependRef"
                    class="py-3 text-xs text-gray-500 font-medium pe-3"
                >
                    <slot name="prepend" />
                </div>

                <div class="grow relative">
                    <input
                        :id="id"
                        ref="inputTemplate"
                        v-model="modelValueFormatted"
                        :autocomplete="autocomplete"
                        :autofocus="autofocus"
                        :dir="isLtr ? 'ltr' : 'rtl'"
                        :disabled="disabled"
                        :placeholder="placeholder"
                        :type="computeType"
                        class="text-cyan-950/70 w-full text-sm bg-transparent"
                        @blur="data.isFocused = false"
                        @focus="data.isFocused = true"
                    >
                </div>

                <div
                    ref="appendRef"
                    class="py-3 text-gray-500 text-xs font-medium ps-3"
                    @mousedown.prevent
                    @mousedown.stop
                    @click.prevent
                >
                    <BaseButton
                        v-if="copyable"
                        class="h-9 w-9 !p-0 bg-transparent base-button_none"
                        @click.stop="() => copy(modelValue || '')"
                    >
                        <SvgIcon
                            v-if="copied"
                            class="w-full text-teal-500 h-full"
                            name="clipboard-tick-outline"
                        />
                        <SvgIcon
                            v-else
                            class="w-full text-cyan-950 h-full"
                            name="document-copy"
                        />
                    </BaseButton>
                    <BaseButton
                        v-else-if="isPassword"
                        class="h-9 w-9 !p-0 bg-transparent base-button_none"
                        @click.stop="togglePassword"
                    >
                        <SvgIcon
                            v-if="data.showPassword"
                            class="text-cyan-950"
                            name="eye-outline"
                        />
                        <SvgIcon v-else name="eye-slash-outline" />
                    </BaseButton>
                    <slot v-else name="append" />
                </div>
            </div>

            <div class="mt-2 min-h-4 text-xs">
                <Transition mode="out-in" name="slide-fade">
                    <span
                        v-if="data.errorText"
                        :key="`error${data.errorText}`"
                        class="inline-block font-medium text-xs text-rose-500"
                    >
                        {{ data.errorText }}
                    </span>
                    <span
                        v-else-if="hint"
                        key="hint"
                        class="inline-block text-xs text-cyan-950/50"
                    >
                        {{ hint }}
                    </span>
                </Transition>
            </div>
        </template>
    </div>
</template>

<style scoped>
.floating-label {
    @apply absolute origin-[left_center] transform translate-y-[-50%] top-1/2 select-none cursor-text z-10 pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis bg-white px-1 text-sm text-cyan-950/70;
}

.label-active {
    @apply text-xs  top-0 transform translate-y-[calc(-50%_-_2px)] scale-[0.98] !start-4;
}

.input:focus:not(.error),
.input:focus-within:not(.error) {
    @apply outline-teal-500 outline-2 outline-offset-[3px];
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    @apply transition-all duration-100 ease-in-out;
    max-height: 100px;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    @apply opacity-0 -translate-y-2 max-h-0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    @apply opacity-100 translate-y-0 max-h-16;
}

/* input autofill fix */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
    box-shadow: 0 0 0px 1000px white inset !important;
    -webkit-text-fill-color: #000 !important;
}
</style>
