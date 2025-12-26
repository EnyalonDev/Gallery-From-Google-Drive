"use client";

import React, { useState, useEffect } from 'react';
import DriveGallery from './components/DriveGallery';
import './App.css';

const DEFAULT_API = "https://script.google.com/macros/s/YOUR_SCRIPT_DEPLOYMENT_ID/exec";
const DEFAULT_GALLERIES = [
  { id: 'g1', name: 'Galería 1', url: 'https://drive.google.com/drive/folders/YOUR_DRIVE_FOLDER_ID_1' },
];

export default function App() {
  const [galleries, setGalleries] = useState(DEFAULT_GALLERIES);
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API);
  const [activeTab, setActiveTab] = useState('');
  const [view, setView] = useState('home'); // 'home' | 'config'

  // Load Config
  useEffect(() => {
    const savedApi = localStorage.getItem('ag_react_api');
    const savedGalleries = localStorage.getItem('ag_react_galleries');

    if (savedApi) setApiBaseUrl(savedApi);
    if (savedGalleries) {
      const parsed = JSON.parse(savedGalleries);
      setGalleries(parsed);
      if (parsed.length > 0) setActiveTab(parsed[0].id);
    } else {
      setActiveTab(DEFAULT_GALLERIES[0].id);
    }
  }, []);

  const saveConfig = (newApi, newGalleries) => {
    setApiBaseUrl(newApi);
    setGalleries(newGalleries);
    localStorage.setItem('ag_react_api', newApi);
    localStorage.setItem('ag_react_galleries', JSON.stringify(newGalleries));
    setView('home');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gallery From Google Drive <span style={{ fontSize: '1rem', color: '#94a3b8', margin: '0 10px' }}>Option 2</span> <span className="badge">React</span></h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>Component Based Architecture</p>
          <button
            onClick={() => setView(view === 'home' ? 'config' : 'home')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {view === 'home' ? '⚙️ Configurar' : '← Volver'}
          </button>
        </div>
      </header>

      {view === 'config' ? (
        <ConfigPanel
          currentApi={apiBaseUrl}
          currentGalleries={galleries}
          onSave={saveConfig}
        />
      ) : (
        <>
          <div className="tabs-container">
            {galleries.map(g => (
              <button
                key={g.id}
                className={`tab-btn ${activeTab === g.id ? 'active' : ''}`}
                onClick={() => setActiveTab(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>

          <div className="gallery-content">
            {galleries.map(g => (
              <div key={g.id} style={{ display: activeTab === g.id ? 'block' : 'none' }}>
                <DriveGallery
                  folderUrl={g.url}
                  active={activeTab === g.id}
                  apiBaseUrl={apiBaseUrl}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ConfigPanel({ currentApi, currentGalleries, onSave }) {
  const [api, setApi] = useState(currentApi);
  const [localGalleries, setLocalGalleries] = useState(currentGalleries);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const add = (e) => {
    e.preventDefault();
    setLocalGalleries([...localGalleries, { id: 'g' + Date.now(), name: newName, url: newUrl }]);
    setNewName(''); setNewUrl('');
  };

  const remove = (idx) => {
    if (confirm('Eliminar?')) {
      const copy = [...localGalleries];
      copy.splice(idx, 1);
      setLocalGalleries(copy);
    }
  };

  const update = (idx, field, val) => {
    const copy = [...localGalleries];
    copy[idx][field] = val;
    setLocalGalleries(copy);
  };

  return (
    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
      <h3>Configuración</h3>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', color: '#94a3b8' }}>API URL</label>
        <input value={api} onChange={e => setApi(e.target.value)} style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        {localGalleries.map((g, i) => (
          <div key={g.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input value={g.name} onChange={e => update(i, 'name', e.target.value)} style={{ background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '5px', width: '150px' }} />
            <input value={g.url} onChange={e => update(i, 'url', e.target.value)} style={{ background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '5px', flex: 1 }} />
            <button onClick={() => remove(i)} style={{ background: 'red', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
          </div>
        ))}
      </div>

      <form onSubmit={add} style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '10px', background: '#0f172a', borderRadius: '4px' }}>
        <input placeholder="Nombre" value={newName} onChange={e => setNewName(e.target.value)} required style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '5px' }} />
        <input placeholder="URL" value={newUrl} onChange={e => setNewUrl(e.target.value)} required style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '5px', flex: 1 }} />
        <button type="submit" style={{ background: '#38bdf8', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Añadir</button>
      </form>

      <button onClick={() => onSave(api, localGalleries)} style={{ background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar</button>
    </div>
  );
}
