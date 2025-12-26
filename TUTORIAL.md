# 🎓 Tutorial: How to Save Server Space using Google Drive

**Problem:** Hosting high-quality images on your own VPS or hosting plan uses up valuable disk space and eats into your bandwidth limits.
**Solution:** Use Google Drive as a Content Delivery Network (CDN) for your galleries.

This tutorial guides you through the architecture of the "Gallery From Google Drive" system.

---

## 1. The Architecture

Instead of:
`User Browser <--> Your Server (Images)`

We do:
1. `User Browser` asks `Google Apps Script` for a list of images.
2. `Google Apps Script` scans `Google Drive Folder`.
3. `Google Apps Script` returns a JSON list of image URLs (direct links).
4. `User Browser` downloads images directly from `Google Drive`.

**Benefit:** Your server only serves the HTML/JS code (kilobytes). Google Drive serves the heavy images (megabytes).

## 2. The Backend Script (`DriveImageExtractor.js`)

The specific magic happens in the `doGet(e)` function. Web Apps in Google Apps Script must use `doGet` or `doPost`.

```javascript
function doGet(e) {
  // e.parameter.url contains the Drive Folder Link sent from frontend
  var folderUrl = e.parameter.url;
  // ... functionality to scan folder ...
}
```

We primarily use `DriveApp` service:
- `DriveApp.getFolderById(id)`: Gets the folder.
- `folder.getFiles()`: Iterates through files.
- `file.getMimeType()`: Checks if it's an image.

**Cool Trick:**
We use a special Google URL format for images: `https://drive.google.com/thumbnail?id=FILE_ID`.
By appending `&sz=w1000`, we can ask Google to generate a version of the image that is 1000px wide on the fly!
- `&sz=w300`: Good for small cards.
- `&sz=w1600`: Good for full-screen modals.

## 3. The Frontend (Your Website)

We have provided 4 ways to consume this data.

### IF YOU USE WORDPRESS / BASIC HTML (Option 1)
Use **Vanilla JS**. It works everywhere.
Copy the `index.html` structure. The key is the `fetch()` function:

```javascript
fetch(YOUR_SCRIPT_URL + "?url=" + DRIVE_FOLDER_URL)
  .then(response => response.json())
  .then(data => {
      // Loop through 'data' and create <img> tags
  });
```

### IF YOU USE REACT / VUE (Option 2, 4)
Use a **Client-Side Effect**.
- In React: `useEffect`.
- In Vue: `onMounted`.

The flow is:
1. Component Mounts.
2. State variable `loading` = true.
3. Fetch data.
4. Update State `images` = data.
5. Component re-renders with the image grid.

### IF YOU USE NEXT.JS (Option 3)
You can use **Client Components** (easier for dynamic galleries like this which depend on browser navigation) or **Server Components** (if the gallery URL is hardcoded and you want SEO).

Our Option 3 uses `use client` to allow for the dynamic "Config Panel" and tabs system, making it behave like a Single Page Application (SPA).

## 4. Security & Performance Notes

- **Public Access**: Your Drive folder DOES NOT need to be "Public on the Web", but it helps prevent permission issues. "Anyone with the link can view" is the recommended setting.
- **Quotas**: Google Apps Script has daily quotas (e.g., 50k requests/day for consumer accounts). This is plenty for small to medium sites. For high traffic, consider caching the JSON response on your side.
- **Speed**: The initial call to the Script API takes 1-2 seconds (Google wake-up time). We handle this on the frontend with a "Loading Spinner".

---

