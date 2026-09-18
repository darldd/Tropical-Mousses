/**
 * TROPICAL MOUSSE — Google Apps Script
 *
 * PASOS:
 * 1. Crea una Google Sheet.
 * 2. Extensiones → Apps Script.
 * 3. Borra el contenido y pega este archivo.
 * 4. Guarda.
 * 5. Implementar → Nueva implementación → Aplicación web.
 * 6. Ejecutar como: Yo. Quién tiene acceso: Cualquiera.
 * 7. Copia la URL que termina en /exec.
 * 8. Pégala en GOOGLE_SHEETS_URL dentro de script.js.
 */
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha', 'Nombre', 'Cantidad', 'Entrega', 'Teléfono', 'Nota', 'Marca']);
  }

  const data = JSON.parse(e.postData.contents || '{}');
  sheet.appendRow([
    data.fecha || new Date(),
    data.nombre || '',
    data.cantidad || '',
    data.entrega || '',
    data.telefono || '',
    data.nota || '',
    data.brand || 'Tropical Mousse'
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
