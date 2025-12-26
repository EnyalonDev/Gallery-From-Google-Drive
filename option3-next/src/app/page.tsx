"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GalleryTabs from '../components/GalleryTabs';

// Default Defaults
const DEFAULT_API = "https://script.google.com/macros/s/YOUR_SCRIPT_DEPLOYMENT_ID/exec";
const DEFAULT_GALLERIES = [
  { id: 'g1', name: 'Galería 1', url: 'https://drive.google.com/drive/folders/YOUR_DRIVE_FOLDER_ID_1' },
];

export default function Home() {
  const [galleries, setGalleries] = useState(DEFAULT_GALLERIES);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load config from Storage
    const savedApi = localStorage.getItem('ag_api_url');
    const savedGalleries = localStorage.getItem('ag_galleries');

    if (savedApi) setApiUrl(savedApi);
    if (savedGalleries) {
      try {
        setGalleries(JSON.parse(savedGalleries));
      } catch (e) { }
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null; // Prevent hydration mismatch

  return (
    <main>
      {/* Admin Bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.5rem 5% 0',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <Link
          href="/config"
          style={{
            background: 'rgba(255,255,255,0.05)',
            color: '#94a3b8',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          ⚙️ Configurar Galerías
        </Link>
      </div>

      <GalleryTabs galleries={galleries} apiBaseUrl={apiUrl} />
    </main>
  );
}

