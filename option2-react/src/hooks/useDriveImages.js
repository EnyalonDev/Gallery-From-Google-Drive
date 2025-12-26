import { useState, useEffect } from 'react';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwXR3FNkbdbPoFr_bTuFKXD1mzQFW8X_sv1_s96_SbabCuYgb5GveOgkocz18-gd0bD/exec";

export function useDriveImages(folderUrl) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si no hay URL, no hacemos nada
        if (!folderUrl) return;

        let isMounted = true;
        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                const targetUrl = `${APPS_SCRIPT_URL}?url=${encodeURIComponent(folderUrl)}`;
                const response = await fetch(targetUrl);

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const json = await response.json();

                if (json.error) {
                    throw new Error(json.error);
                }

                if (isMounted) {
                    setData(json);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [folderUrl]);

    return { data, loading, error };
}
