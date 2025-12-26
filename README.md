# 🖼️ Gallery From Google Drive 
### Turn Google Drive into your CMS & CDN / Convierte Google Drive en tu CMS y CDN

**English**: Stop paying for image hosting. This project allows you to use Google Drive folders as dynamic image galleries for your website.
**Español**: Deja de pagar por hosting de imágenes. Este proyecto te permite usar carpetas de Google Drive como galerías de imágenes dinámicas para tu sitio web.

---

## 🚀 How it Works / Cómo Funciona

1.  **Storage**: Upload images to Google Drive. / Sube imágenes a Google Drive.
2.  **API**: Use the included Apps Script to expose them as JSON. / Usa el Apps Script incluido para exponerlas como JSON.
3.  **Frontend**: Connect your website to that API. / Conecta tu web a esa API.

---

## 📦 Options / Opciones

| Option | Technology | Badge | Status |
| :--- | :--- | :--- | :--- |
| **[Option 1](./Option1)** | **Vanilla JS** | `VANILLA JS` | Simple HTML/CSS/JS. |
| **[Option 2](./option2-react)** | **React** | `REACT` | Vite + React Hooks. |
| **[Option 3](./option3-next)** | **Next.js** | `NEXT.JS` | App Router + Config page. |
| **[Option 4](./option4-vue)** | **Vue.js** | `VUE.JS` | Vue 3 + Vite. |

---

## 🛠️ Global Setup (Required) / Configuración Global (Requerida)

### 1. Backend API (Google Apps Script)

**English Instructions:**
1. Go to [script.google.com](https://script.google.com/).
2. Create New Project.
3. Paste code from `DriveImageExtractor.js`.
4. **Deploy** -> **New Deployment** -> **Web App**.
5. Set "Who has access" to **"Anyone"**.
6. Copy the URL (ends in `/exec`).

**Instrucciones en Español:**
1. Ve a [script.google.com](https://script.google.com/).
2. Crea un Nuevo Proyecto.
3. Pega el código de `DriveImageExtractor.js`.
4. Clic en **Implementar** -> **Nueva implementación** -> **Aplicación web**.
5. Configura "Quién tiene acceso" a **"Cualquier persona"**.
6. Copia la URL (termina en `/exec`).

### 2. Google Drive Folder

**English:**
1. Create a folder in Drive.
2. Set sharing to **"Anyone with the link"**.
3. Copy Folder URL.

**Español:**
1. Crea una carpeta en Drive.
2. Configura compartir como **"Cualquier persona con el enlace"**.
3. Copia la URL de la carpeta.

---

## 📚 Documentation / Documentación

- [Full Tutorial (English)](./TUTORIAL.md)

---

**Developed by / Desarrollado por**: Néstor Ovallos Cañas
- 🌐 [www.nestorovallos.com](https://www.nestorovallos.com)
- 🎨 [www.portafoliocreativo.com](https://www.portafoliocreativo.com)
