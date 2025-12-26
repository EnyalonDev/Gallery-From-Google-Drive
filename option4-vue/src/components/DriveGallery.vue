<script setup>
import { ref, computed, toRefs, onMounted, onUnmounted } from 'vue';
import { useDriveImages } from '../composables/useDriveImages';

const props = defineProps({
  folderUrl: String,
  active: Boolean,
  apiBaseUrl: String
});

const { active, apiBaseUrl } = toRefs(props);
const { data, loading, error } = useDriveImages(props.folderUrl, active, apiBaseUrl);

const selectedIndex = ref(null);

const openModal = (index) => {
  selectedIndex.value = index;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  selectedIndex.value = null;
  document.body.style.overflow = 'auto';
};

const showNext = (e) => {
  if (e) e.stopPropagation();
  if (selectedIndex.value !== null) {
    selectedIndex.value = (selectedIndex.value + 1) % data.value.length;
  }
};

const showPrev = (e) => {
  if (e) e.stopPropagation();
  if (selectedIndex.value !== null) {
    selectedIndex.value = (selectedIndex.value - 1 + data.value.length) % data.value.length;
  }
};

const selectedImage = computed(() => 
  selectedIndex.value !== null ? data.value[selectedIndex.value] : null
);

// Keyboard
const handleKey = (e) => {
  if (selectedIndex.value === null) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
};

onMounted(() => window.addEventListener('keydown', handleKey));
onUnmounted(() => window.removeEventListener('keydown', handleKey));

</script>

<template>
  <div>
    <div v-if="loading" class="loader">
      <div class="spinner"></div>
      <p>Cargando galería (Vue)...</p>
    </div>

    <div v-else-if="error" class="error-msg">
      Error: {{ error }}
    </div>

    <div v-else-if="data.length === 0 && !loading && active" class="empty-msg">
      Carpeta vacía
    </div>

    <template v-else>
      <div class="gallery-grid">
        <div 
          v-for="(item, index) in data" 
          :key="item.id" 
          class="card"
          @click="openModal(index)"
        >
          <div class="image-wrapper">
            <img :src="item.variants.medium" :alt="item.name" loading="lazy" />
            <div class="overlay">
              <span class="icon">🔍</span>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL -->
      <teleport to="body">
        <div v-if="selectedImage" class="modal-overlay" @click="closeModal">
          <button class="nav-btn prev-btn" @click.stop="showPrev">&#10094;</button>

          <div class="modal-content" @click.stop>
            <transition name="slide-fade" mode="out-in">
                <img 
                :key="selectedImage.id"
                :src="selectedImage.variants.large || selectedImage.variants.original" 
                :alt="selectedImage.name" 
                class="modal-image"
                />
            </transition>
          </div>

          <button class="nav-btn next-btn" @click.stop="showNext">&#10095;</button>
          <button class="close-btn" @click.stop="closeModal">×</button>

          <div class="info-bar">
            <span class="info-counter">{{ selectedIndex + 1 }} / {{ data.length }}</span>
          </div>
        </div>
      </teleport>
    </template>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #94a3b8;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(56, 189, 248, 0.3);
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s;
}
.card:hover { transform: scale(1.02); z-index: 10; border-color: #38bdf8; }

.image-wrapper { width: 100%; aspect-ratio: 1/1; position: relative; }
.image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.3);
  opacity: 0; display: flex; align-items: center; justify-content: center;
  transition: opacity 0.2s;
}
.card:hover .overlay { opacity: 1; }
.icon { font-size: 2rem; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.92); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
}
.modal-content {
  position: relative; max-width: 85vw; max-height: 85vh;
}
.modal-image {
  max-width: 100%; max-height: 85vh; object-fit: contain; block-size: auto;
}

.nav-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.1); color: white; border: none;
  width: 60px; height: 60px; border-radius: 50%; font-size: 30px;
  cursor: pointer; backdrop-filter: blur(4px); z-index: 20;
}
.nav-btn:hover { background: rgba(255,255,255,0.3); }
.prev-btn { left: 20px; }
.next-btn { right: 20px; }

.close-btn {
  position: absolute; top: 20px; right: 20px;
  background: rgba(255,255,255,0.1); color: white; border: none;
  width: 44px; height: 44px; font-size: 28px; border-radius: 50%;
  cursor: pointer; z-index: 20;
}
.close-btn:hover { background: #ef4444; }

.info-bar {
  position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
  background: rgba(20, 20, 25, 0.8); backdrop-filter: blur(10px);
  padding: 8px 20px; border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.1);
}
.info-counter { color: #38bdf8; font-weight: 600; font-size: 1rem; }

/* Transition Vue */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(10px);
}
</style>
