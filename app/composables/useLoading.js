/**
 * Custom loading state management hook.
 *
 * This composable provides a reactive `isLoading` state and functions to enable or disable loading.
 *
 * @param {boolean} [initialValue=false] - Initial loading state.
 * @returns {import('vue').Ref<boolean>} returns.isLoading - Reactive loading state.
 * @returns {Function} returns.enableLoading - Function to set loading state to `true`.
 * @returns {Function} returns.disableLoading - Function to set loading state to `false`.
 * @returns {object} Loading state and control functions.
 */

export function useLoading(initialValue = false) {
    const isLoading = ref(initialValue);
    const enableLoading = () => (isLoading.value = true);
    const disableLoading = () => (isLoading.value = false);

    return {
        isLoading,
        enableLoading,
        disableLoading,
    };
}
