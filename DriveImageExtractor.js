/**
 * ============================================================================
 * GOOGLE DRIVE IMAGE EXTRACTOR
 * ============================================================================
 * 
 * TUTORIAL DE INSTALACIÓN:
 * 1. Crea un nuevo Apps Script en https://script.google.com/
 * 2. Pega este código completo.
 * 3. Haz clic en "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 * 4. Selecciona tipo: "Aplicación web" (Web app).
 * 5. Configura:
 *    - Ejecutar como: "Yo" (Me).
 *    - Quién tiene acceso: "Cualquier persona" (Anyone). 
 *    (Esto es crucial para que tu web pueda leer las imágenes sin login).
 * 6. Copia la URL de la Aplicación Web (termina en /exec).
 *    Esa es tu "API_URL" que usarás en el frontend.
 * 
 * USO:
 * Haz una petición GET a tu URL desplegada con el parámetro ?url=
 * Ejemplo: https://script.google.com/.../exec?url=HTTPS://DRIVE.GOOGLE.COM/...
 * 
 * ============================================================================
 */

function doGet(e) {
    // Enable CORS to allow requests from any website
    var output = ContentService.createTextOutput();

    // Check parameters
    if (!e || !e.parameter || !e.parameter.url) {
        return createJSONOutput({
            error: "Falta el parámetro 'url'. Proporciona la URL completa de la carpeta de Drive."
        });
    }

    var folderUrl = e.parameter.url;
    var jsonResponse = getImageDataFromDriveFolder(folderUrl);

    return createJSONOutput(jsonResponse);
}

// Helper to create JSON response with CORS headers
function createJSONOutput(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

function getImageDataFromDriveFolder(folderUrl) {
    // 1. Extract Folder ID
    var folderId = "";
    try {
        var idMatch = folderUrl.match(/[-\w]{25,}/);
        if (idMatch) {
            folderId = idMatch[0];
        } else {
            throw new Error("No se pudo extraer el ID de la carpeta.");
        }
    } catch (e) {
        return { error: "URL inválida: " + e.message };
    }

    var imagesData = [];

    try {
        var folder = DriveApp.getFolderById(folderId);
        var files = folder.getFiles();

        while (files.hasNext()) {
            var file = files.next();
            var mimeType = file.getMimeType();

            // Check if it's an image
            if (mimeType.indexOf("image/") === 0) {
                var id = file.getId();

                // Construct Thumbnail/Preview URLs
                // This 'sz' parameter trick allows resizing dynamic images from Drive
                var baseUrl = "https://drive.google.com/thumbnail?id=" + id;

                // Alternate direct link logic if needed in future
                // var directLink = "https://drive.google.com/uc?export=view&id=" + id;

                imagesData.push({
                    id: id,
                    name: file.getName(),
                    mimeType: mimeType,
                    // View in Drive
                    viewUrl: file.getUrl(),
                    // Direct download/view link
                    downloadUrl: "https://drive.google.com/uc?export=view&id=" + id,
                    // Smart Variants for Responsive Web Design
                    variants: {
                        small: baseUrl + "&sz=w300",      // Thumbnails
                        medium: baseUrl + "&sz=w800",     // Grid View
                        large: baseUrl + "&sz=w1600",     // Modal/Full View
                        original: baseUrl + "&sz=w10000"  // Max available
                    },
                    sizeBytes: file.getSize()
                });
            }
        }
    } catch (e) {
        return { error: "Error accediendo a carpeta (Asegúrate que sea 'Cualquier persona con el enlace' o pública): " + e.message };
    }

    return imagesData;
}

// TEST FUNCTION (Run inside Editor)
function testScript() {
    var url = "Poner_URL_Carpeta_Drive_Aqui_Para_Test";
    if (url.indexOf("http") === -1) {
        Logger.log("Edita la variable 'url' en la función testScript para probar.");
        return;
    }
    var result = getImageDataFromDriveFolder(url);
    Logger.log(JSON.stringify(result, null, 2));
}
