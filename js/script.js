// Resuelve la ruta al JSON intentando usar la ubicación del propio script.
// Si no está disponible, cae a una ruta raíz por defecto.
const JSON_URL = (function () {
  try {
    // document.currentScript funciona cuando el script se ejecuta desde un archivo .js cargado con src
    const script = document.currentScript || document.querySelector('script[src$="script.js"]');
    if (script && script.src) {
      return new URL('../data/productos.json', script.src).href;
    }
  } catch (e) {
    // ignore
  }
  // Fallback: ruta absoluta desde la raíz del servidor
  return '/data/productos.json';
})();

function renderizarProductos() {
    // Soportar ambos posibles IDs para evitar la inconsistencia
    const selectElement = document.getElementById('products-select') || document.getElementById('productos-select');
    if (!selectElement) {
        console.error("Error: No se encontró el elemento <select> con el ID 'products-select' ni 'productos-select'.");
        return;
    }

    if (location.protocol === 'file:') {
      console.warn('Estás sirviendo la página con file:// — fetch de recursos locales probablemente fallará. Usa un servidor HTTP (ej. live-server).');
    }

    fetch(JSON_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(productos => {
            if (!Array.isArray(productos)) {
                console.error('El JSON no tiene el formato esperado (array).', productos);
                return;
            }
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.peso_unitario_gramos ?? '';
                option.textContent = `${producto.nombre ?? 'Sin nombre'} ($${producto.precio ?? '—'})`;
                selectElement.appendChild(option);
            });
            console.log("Productos cargados y renderizados correctamente.");
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });
}
renderizarProductos();

//seteo fecha y hora 
const tiempo = new Date();
const fechaLegible = tiempo.toLocaleString('es-AR');

document.getElementById("timeDate").textContent = fechaLegible;

Swal.fire({
  title: "<strong>HTML <u>example</u></strong>",
  icon: "info",
  html: `
    You can use <b>bold text</b>,
    <a href="#" autofocus>links</a>,
    and other HTML tags
  `,
  showCloseButton: true,
  showCancelButton: true,
  focusConfirm: false,
  confirmButtonText: `
    <i class="fa fa-thumbs-up"></i> Great!
  `,
  confirmButtonAriaLabel: "Thumbs up, great!",
  cancelButtonText: `
    <i class="fa fa-thumbs-down"></i>
  `,
  cancelButtonAriaLabel: "Thumbs down"
});
