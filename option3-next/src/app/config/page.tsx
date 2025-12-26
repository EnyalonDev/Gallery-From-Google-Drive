"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ConfigStyles.module.css';

const DEFAULT_API = "https://script.google.com/macros/s/YOUR_SCRIPT_DEPLOYMENT_ID/exec";

const DEFAULT_GALLERIES = [
    { id: 'g1', name: 'Galería 1', url: 'https://drive.google.com/drive/folders/YOUR_DRIVE_FOLDER_ID_1' },
];

export default function ConfigPage() {
    const [apiUrl, setApiUrl] = useState(DEFAULT_API);
    const [galleries, setGalleries] = useState(DEFAULT_GALLERIES);

    // Local state for editing
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editUrl, setEditUrl] = useState('');

    // New gallery state
    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedApi = localStorage.getItem('ag_api_url');
        const savedGalleries = localStorage.getItem('ag_galleries');

        if (savedApi) setApiUrl(savedApi);
        if (savedGalleries) {
            try {
                setGalleries(JSON.parse(savedGalleries));
            } catch (e) { }
        }
    }, []);

    // Save functionality
    const saveAll = () => {
        localStorage.setItem('ag_api_url', apiUrl);
        localStorage.setItem('ag_galleries', JSON.stringify(galleries));
        alert('Configuración guardada correctamente.');
    };

    const resetDefaults = () => {
        if (confirm('¿Restablecer todo a los valores originales?')) {
            setApiUrl(DEFAULT_API);
            setGalleries(DEFAULT_GALLERIES);
            localStorage.removeItem('ag_api_url');
            localStorage.removeItem('ag_galleries');
        }
    };

    // Gallery Management
    const addGallery = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newUrl) return;

        const newG = {
            id: `g${Date.now()}`,
            name: newName,
            url: newUrl
        };

        setGalleries([...galleries, newG]);
        setNewName('');
        setNewUrl('');
    };

    const deleteGallery = (id: string) => {
        if (confirm('¿Eliminar esta galería?')) {
            setGalleries(galleries.filter(g => g.id !== id));
        }
    };

    const startEdit = (g: any) => {
        setEditId(g.id);
        setEditName(g.name);
        setEditUrl(g.url);
    };

    const saveEdit = () => {
        setGalleries(galleries.map(g => {
            if (g.id === editId) {
                return { ...g, name: editName, url: editUrl };
            }
            return g;
        }));
        setEditId(null);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>⚙️ Configuración del Sistema</h1>
                <Link href="/" className={styles.backBtn}>← Volver a Galerías</Link>
            </header>

            <section className={styles.section}>
                <h2>🔗 Conexión API (Apps Script)</h2>
                <p className={styles.hint}>La URL de despliegue de tu script de Google.</p>
                <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className={styles.inputFull}
                />
            </section>

            <section className={styles.section}>
                <h2>📂 Gestión de Galerías</h2>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>URL de Carpeta Drive</th>
                                <th style={{ width: '120px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {galleries.map(g => (
                                <tr key={g.id}>
                                    <td>
                                        {editId === g.id ? (
                                            <input
                                                className={styles.inputTable}
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                            />
                                        ) : g.name}
                                    </td>
                                    <td>
                                        {editId === g.id ? (
                                            <input
                                                className={styles.inputTable}
                                                value={editUrl}
                                                onChange={e => setEditUrl(e.target.value)}
                                            />
                                        ) : (
                                            <span className={styles.urlText}>{g.url}</span>
                                        )}
                                    </td>
                                    <td className={styles.actionsCell}>
                                        {editId === g.id ? (
                                            <>
                                                <button onClick={saveEdit} className={styles.btnSuccess}>💾</button>
                                                <button onClick={() => setEditId(null)} className={styles.btnCancel}>✕</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(g)} className={styles.btnEdit}>✎</button>
                                                <button onClick={() => deleteGallery(g.id)} className={styles.btnDelete}>🗑️</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add New Form */}
                <form onSubmit={addGallery} className={styles.addForm}>
                    <h3>Añadir Nueva</h3>
                    <div className={styles.flexRow}>
                        <input
                            placeholder="Nombre (Ej: Evento 2025)"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            className={styles.input}
                            required
                        />
                        <input
                            placeholder="URL de Google Drive..."
                            value={newUrl}
                            onChange={e => setNewUrl(e.target.value)}
                            className={`${styles.input} ${styles.flexGrow}`}
                            required
                        />
                        <button type="submit" className={styles.btnAdd}>+ Añadir</button>
                    </div>
                </form>
            </section>

            <footer className={styles.footer}>
                <button onClick={resetDefaults} className={styles.btnSecondary}>Restablecer Defaults</button>
                <button onClick={saveAll} className={styles.btnPrimary}>Guardar Cambios</button>
            </footer>
        </div>
    );
}
