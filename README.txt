TROPICAL MOUSSE V15
====================

Incluye:
- index.html
- style.css
- script.js
- google-apps-script.gs

FUNCIONAMIENTO DEL PEDIDO
1. El cliente llena el formulario.
2. El pedido se envía a Google Sheets cuando GOOGLE_SHEETS_URL está configurada.
3. Se abre WhatsApp del negocio con el pedido completo.
4. El negocio recibe el mensaje en WhatsApp y ve el pedido en la hoja.

WHATSAPP
Número configurado: 849 440 4797
Si quieres usar el otro número, cambia BUSINESS_WHATSAPP en script.js.

GOOGLE SHEETS
Sigue los pasos comentados dentro de google-apps-script.gs.
Después pega la URL /exec en GOOGLE_SHEETS_URL al inicio de script.js.

IMPORTANTE
GitHub Pages no puede escribir directamente en un Excel local. Google Sheets + Apps Script funciona como el puente gratuito para guardar los pedidos.
