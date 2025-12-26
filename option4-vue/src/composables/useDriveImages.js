import { ref, watch, onUnmounted } from 'vue';

export function useDriveImages(folderUrl, active, apiBaseUrl) {
    const data = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const hasLoaded = ref(false);

    // Watch for 'active' changes to trigger load if not already loaded
    watch(() => active.value, (isActive) => {
        if (isActive && !hasLoaded.value && folderUrl && apiBaseUrl.value) {
            fetchData();
        }
    }, { immediate: true });

    async function fetchData() {
        loading.value = true;
        error.value = null;

        try {
            const res = await fetch(`${apiBaseUrl.value}?url=${encodeURIComponent(folderUrl)}`);
            if (!res.ok) throw new Error('Network error');
            const json = await res.json();

            if (json.error) throw new Error(json.error);

            data.value = json;
            hasLoaded.value = true;
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    return { data, loading, error };
}
