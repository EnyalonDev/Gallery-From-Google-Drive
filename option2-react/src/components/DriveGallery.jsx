import React, { useState, useEffect, useCallback } from 'react';
import './DriveGallery.css';

// CONFIGURACIÓN Default
const DEFAULT_API_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_DEPLOYMENT_ID/exec";

const DriveGallery = ({ folderUrl, active, apiBaseUrl }) => {
    const [shouldLoad, setShouldLoad] = useState(active);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const apiUrl = apiBaseUrl || DEFAULT_API_URL;

    // Preload next/prev images for smoother navigation can be added here, 
    // but for now we rely on browser cache since we used 'variants'.

    useEffect(() => {
        if (active) setShouldLoad(true);
    }, [active]);

    useEffect(() => {
        if (!shouldLoad || !folderUrl) {
            setData([]);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${apiUrl}?url=${encodeURIComponent(folderUrl)}`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const result = await res.json();
                if (result.error) {
                    throw new Error(result.error);
                }
                setData(result);
            } catch (err) {
                console.error("Failed to fetch images:", err);
                setError(err.message || "Error al cargar las imágenes.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shouldLoad, folderUrl, apiUrl]);

    const openModal = (index) => {
        setSelectedIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = useCallback(() => {
        setSelectedIndex(null);
        document.body.style.overflow = 'auto';
    }, []);

    const showNext = useCallback((e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % data.length);
    }, [data.length]);

    const showPrev = useCallback((e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + data.length) % data.length);
    }, [data.length]);

    // Keyboard navigation
    useEffect(() => {
        if (selectedIndex === null) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, closeModal, showNext, showPrev]);

    if (!shouldLoad) return null;

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
                <p>Cargando galería...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-msg">
                <h3>Error al cargar</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (data.length === 0) {
        return <div className="empty-msg">La carpeta está vacía.</div>;
    }

    const selectedImage = selectedIndex !== null ? data[selectedIndex] : null;

    return (
        <>
            <div className="gallery-grid">
                {data.map((item, index) => (
                    <div
                        key={item.id}
                        className="gallery-card-simple"
                        onClick={() => openModal(index)}
                    >
                        <div className="card-image-wrapper">
                            <img
                                src={item.variants.medium}
                                alt={item.name}
                                loading="lazy"
                            />
                            <div className="card-overlay-simple">
                                <span className="idx-icon">🔍</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selectedImage && (
                <div className="modal-overlay" onClick={closeModal}>

                    {/* Left Arrow */}
                    <button className="nav-btn prev-btn" onClick={showPrev}>
                        &#10094;
                    </button>

                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {/* 
                  KEY PROP IS CRITICAL for Animation: 
                  Changing the key forces React to re-mount the image, 
                  triggering the CSS animation every time the slide changes.
                */}
                        <img
                            key={selectedImage.id}
                            src={selectedImage.variants.large || selectedImage.variants.original}
                            alt={selectedImage.name}
                            className="modal-image"
                        />
                    </div>

                    {/* Right Arrow */}
                    <button className="nav-btn next-btn" onClick={showNext}>
                        &#10095;
                    </button>

                    <button className="close-btn" onClick={closeModal}>×</button>

                    {/* Counter Info */}
                    <div className="modal-info-bar">
                        <span className="info-counter">
                            {selectedIndex + 1} / {data.length}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default DriveGallery;
