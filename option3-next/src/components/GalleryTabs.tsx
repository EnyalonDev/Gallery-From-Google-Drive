"use client";

import React, { useState } from 'react';
import styles from './GalleryStyles.module.css';
import DriveGallery from './DriveGallery';

interface GalleryConfig {
    id: string;
    name: string;
    url: string;
}

interface GalleryTabsProps {
    galleries: GalleryConfig[];
    apiBaseUrl?: string;
}

export default function GalleryTabs({ galleries, apiBaseUrl }: GalleryTabsProps) {
    const [activeTab, setActiveTab] = useState(galleries[0]?.id);

    return (
        <div className={styles.container}>
            {/* HEADER */}
            <header className={styles.header}>
                <h1>Gallery From Google Drive <span style={{ fontSize: '1rem', color: '#94a3b8', margin: '0 10px' }}>Option 3</span> <span className={styles.badge}>Next.js</span></h1>
                <p>Lazy Loading Optimized</p>
            </header>

            {/* TABS */}
            <div className={styles.tabsContainer}>
                {galleries.map(g => (
                    <button
                        key={g.id}
                        className={`${styles.tabBtn} ${activeTab === g.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(g.id)}
                    >
                        {g.name}
                    </button>
                ))}
            </div>

            {/* GALLERY CONTENT - All mounted but hidden to preserve state if desired, or conditionally rendered */}
            {/* We use style display none to keep the component mounted/cached if user switches back and forth */}

            {galleries.map(g => (
                <div key={g.id} style={{ display: activeTab === g.id ? 'block' : 'none' }}>
                    <DriveGallery folderUrl={g.url} active={activeTab === g.id} apiBaseUrl={apiBaseUrl} />
                </div>
            ))}
        </div>
    );
}
