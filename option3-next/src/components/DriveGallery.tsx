"use client";

import React, { useState, useEffect, useCallback } from 'react';
import styles from './GalleryStyles.module.css';

// CONFIGURACIÓN (Default fallback)
const DEFAULT_API_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_DEPLOYMENT_ID/exec";

interface DriveGalleryProps {
    folderUrl: string;
    active?: boolean;
    apiBaseUrl?: string;
}

export default function DriveGallery({ folderUrl, active = true, apiBaseUrl }: DriveGalleryProps) {
    const [shouldLoad, setShouldLoad] = useState(active);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use provided API URL or default
    const apiUrl = apiBaseUrl || DEFAULT_API_URL;

    // Modal State
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (active) setShouldLoad(true);
    }, [active]);

    useEffect(() => {
        if (!shouldLoad || data.length > 0) return; // Don't refetch if already loaded

        let isMounted = true;
        setLoading(true);

        const fetchData = async () => {
            try {
                const res = await fetch(`${apiUrl}?url=${encodeURIComponent(folderUrl)}`);
                if (!res.ok) throw new Error('Network response was not ok');
                const json = await res.json();

                if (isMounted) {
                    if (json.error) throw new Error(json.error);
                    setData(json);
                }
            } catch (err: any) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [shouldLoad, folderUrl, data.length]);

    // --- Modal Logic (Duplicated from Opt 2 for independence) ---
    const openModal = (index: number) => {
        setSelectedIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = useCallback(() => {
        setSelectedIndex(null);
        document.body.style.overflow = 'auto';
    }, []);

    const showNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % data.length : null));
    }, [data.length]);

    const showPrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + data.length) % data.length : null));
    }, [data.length]);

    useEffect(() => {
        if (selectedIndex === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, closeModal, showNext, showPrev]);

    // --- Render ---

    if (!shouldLoad) return null; // Invisible until activated once

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Cargando galería...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.errorMsg}>Error: {error}</div>;
    }

    if (data.length === 0) {
        return <div className={styles.emptyMsg}>Carpeta vacía</div>;
    }

    const selectedImage = selectedIndex !== null ? data[selectedIndex] : null;

    return (
        <>
            <div className={styles.galleryGrid}>
                {data.map((item, index) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        onClick={() => openModal(index)}
                    >
                        <div className={styles.imageWrapper}>
                            <img
                                src={item.variants.medium}
                                alt={item.name}
                                loading="lazy"
                            />
                            <div className={styles.overlay}>
                                <span className={styles.icon}>🔍</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={showPrev}>&#10094;</button>

                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <img
                            key={selectedImage.id}
                            src={selectedImage.variants.large || selectedImage.variants.original}
                            alt={selectedImage.name}
                            className={styles.modalImage}
                        />
                    </div>

                    <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={showNext}>&#10095;</button>
                    <button className={styles.closeBtn} onClick={closeModal}>×</button>

                    <div className={styles.infoBar}>
                        <span className={styles.infoCounter}>{selectedIndex + 1} / {data.length}</span>
                    </div>
                </div>
            )}
        </>
    );
}
