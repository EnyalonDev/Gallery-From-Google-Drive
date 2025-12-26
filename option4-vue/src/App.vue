<script setup>
import { ref, watch, onMounted } from 'vue';
import DriveGallery from './components/DriveGallery.vue';

// DEFAULTS
const DEFAULT_API = "https://script.google.com/macros/s/YOUR_SCRIPT_DEPLOYMENT_ID/exec";
const DEFAULT_GALLERIES = [
  { id: 'g1', name: 'Galería 1', url: 'https://drive.google.com/drive/folders/YOUR_DRIVE_FOLDER_ID_1' },
];

// STATE
const activeTab = ref('');
const galleries = ref(DEFAULT_GALLERIES);
const apiBaseUrl = ref(DEFAULT_API);
const currentView = ref('home'); // 'home' | 'config'

// Config State
const tempApi = ref('');
const tempGalleries = ref([]);
const newName = ref('');
const newUrl = ref('');

// LOAD
onMounted(() => {
  const savedApi = localStorage.getItem('ag_vue_api');
  const savedGalleries = localStorage.getItem('ag_vue_galleries');
  
  if(savedApi) apiBaseUrl.value = savedApi;
  if(savedGalleries) {
     const parsed = JSON.parse(savedGalleries);
     galleries.value = parsed;
     if(parsed.length > 0) activeTab.value = parsed[0].id;
  } else {
     activeTab.value = DEFAULT_GALLERIES[0].id;
  }
});

// ACTIONS
function toggleView() {
   currentView.value = currentView.value === 'home' ? 'config' : 'home';
   if(currentView.value === 'config') {
      tempApi.value = apiBaseUrl.value;
      tempGalleries.value = JSON.parse(JSON.stringify(galleries.value));
   }
}

function saveConfig() {
   apiBaseUrl.value = tempApi.value;
   galleries.value = JSON.parse(JSON.stringify(tempGalleries.value));
   
   localStorage.setItem('ag_vue_api', apiBaseUrl.value);
   localStorage.setItem('ag_vue_galleries', JSON.stringify(galleries.value));
   
   currentView.value = 'home';
}

function addGallery() {
   if(!newName.value || !newUrl.value) return;
   tempGalleries.value.push({
      id: 'g' + Date.now(),
      name: newName.value,
      url: newUrl.value
   });
   newName.value = ''; newUrl.value = '';
}

function removeGallery(index) {
   if(confirm('¿Eliminar?')) {
      tempGalleries.value.splice(index, 1);
   }
}
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>Gallery From Google Drive <span style="font-size: 1rem; color: #94a3b8; margin: 0 10px">Option 4</span> <span class="badge">Vue.js</span></h1>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <p>Single File Components (SFC)</p>
        <button class="config-btn" @click="toggleView">
           {{ currentView === 'home' ? '⚙️ Configurar' : '← Volver' }}
        </button>
      </div>
    </header>

    <!-- CONFIG VIEW -->
    <div v-if="currentView === 'config'" class="config-panel">
       <h3>Configuración</h3>
       <div class="form-group">
          <label>API URL</label>
          <input v-model="tempApi" class="input-full" />
       </div>
       
       <div class="list-group">
          <div v-for="(g, idx) in tempGalleries" :key="g.id" class="list-item">
             <input v-model="g.name" class="input-mini" />
             <input v-model="g.url" class="input-flex" />
             <button @click="removeGallery(idx)" class="btn-del">🗑️</button>
          </div>
       </div>

       <form @submit.prevent="addGallery" class="add-form">
          <input v-model="newName" placeholder="Nombre" required class="input-mini" />
          <input v-model="newUrl" placeholder="URL" required class="input-flex" />
          <button type="submit" class="btn-add">Añadir</button>
       </form>

       <button @click="saveConfig" class="btn-save">Guardar Cambios</button>
    </div>

    <!-- HOME VIEW -->
    <div v-else>
      <div class="tabs">
        <button 
          v-for="g in galleries" 
          :key="g.id"
          class="tab-btn"
          :class="{ active: activeTab === g.id }"
          @click="activeTab = g.id"
        >
          {{ g.name }}
        </button>
      </div>

      <div class="content">
        <div 
          v-for="g in galleries" 
          :key="g.id" 
          :style="{ display: activeTab === g.id ? 'block' : 'none' }"
        >
          <DriveGallery 
             :folderUrl="g.url" 
             :active="activeTab === g.id" 
             :apiBaseUrl="apiBaseUrl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 1400px; margin: 0 auto; padding: 0 5%; }
.header { padding: 2rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 2rem; }
.header h1 { margin: 0; font-size: 2rem; background: linear-gradient(90deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.badge { font-size: 0.8rem; background: rgba(66, 184, 131, 0.2); color: #42b883; padding: 2px 8px; border-radius: 4px; -webkit-text-fill-color: #42b883; vertical-align: middle; }
.header p { color: #94a3b8; margin: 0.5rem 0 0 0; }

.config-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; }

/* Tabs */
.tabs { display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center; }
.tab-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 0.8rem 1.5rem; border-radius: 50px; cursor: pointer; transition: all 0.3s; font-family: inherit; font-size: 1rem; }
.tab-btn:hover { background: rgba(255,255,255,0.1); color: white; }
.tab-btn.active { background: #38bdf8; color: #0f172a; font-weight: 600; border-color: #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }

/* Config Panel Styles */
.config-panel { background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155; }
.input-full { width: 100%; padding: 8px; background: #0f172a; border: 1px solid #334155; color: white; }
.list-item { display: flex; gap: 10px; margin-bottom: 10px; }
.input-mini { width: 150px; padding: 5px; background: #0f172a; border: 1px solid #334155; color: white; }
.input-flex { flex: 1; padding: 5px; background: #0f172a; border: 1px solid #334155; color: white; }
.btn-del { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: none; padding: 5px 10px; cursor: pointer; }
.add-form { display: flex; gap: 10px; margin-bottom: 20px; background: #0f172a; padding: 15px; border-radius: 6px; }
.btn-add { background: #38bdf8; color: #0f172a; border: none; padding: 0 20px; cursor: pointer; font-weight: bold; border-radius: 4px; }
.btn-save { background: linear-gradient(90deg, #38bdf8, #818cf8); color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 6px; font-weight: bold; }
</style>
