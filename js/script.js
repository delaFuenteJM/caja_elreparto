//seteo fecha y hora 
const tiempo = new Date();
const fechaLegible = tiempo.toLocaleString('es-AR');

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

// Variables de estado
let pedidoActual = [];
let historialVentas = [];

// Elementos del DOM
const btnAgregar = document.getElementById('btnAgregarProducto');
const btnAceptar = document.getElementById('btnAceptarPedido');
const listaPedido = document.getElementById('listaPedidoActual');
const totalPedidoTxt = document.getElementById('totalPedido');
const contenedorHistorial = document.getElementById('historialVentas');
const selectProductos = document.getElementById('products-select');

// 1. Función para agregar al carrito temporal
btnAgregar.addEventListener('click', () => {
    const selectedOption = selectProductos.options[selectProductos.selectedIndex];
    
    if (selectProductos.value === "") {
        Swal.fire("Nota", "Por favor selecciona un gusto de helado", "info");
        return;
    }

    // Extraemos nombre y precio (asumiendo que los guardas en el objeto o texto)
    const nombre = selectedOption.textContent;
    // Para este ejemplo, usaremos precios fijos o podrías sacarlos del value del select
    const precio = 5000; // Esto es un placeholder, lo ideal es que venga de tu JSON

    pedidoActual.push({ nombre, precio });
    actualizarInterfazPedido();
});

function actualizarInterfazPedido() {
    listaPedido.innerHTML = "";
    let total = 0;

    pedidoActual.forEach((item, index) => {
        total += item.precio;
        listaPedido.innerHTML += `<p>${item.nombre} - $${item.precio}</p>`;
    });

    totalPedidoTxt.innerText = total.toLocaleString('es-AR');
}

// 2. Función para "Aceptar" el pedido (Cobrar)
btnAceptar.addEventListener('click', () => {
    if (pedidoActual.length === 0) {
        Swal.fire("Error", "El pedido está vacío", "error");
        return;
    }

    Swal.fire({
        title: '¿Confirmar cobro?',
        text: `Total a recibir: $${totalPedidoTxt.innerText}`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Recibido',
        cancelButtonText: 'Corregir'
    }).then((result) => {
        if (result.isConfirmed) {
            // Mover a historial
            const ventaFinalizada = {
                items: [...pedidoActual],
                total: pedidoActual.reduce((acc, el) => acc + el.total, 0), // lógica de suma
                hora: new Date().toLocaleTimeString()
            };
            
            historialVentas.push(ventaFinalizada);
            renderizarHistorial();
            
            // Limpiar pedido actual
            pedidoActual = [];
            actualizarInterfazPedido();
            
            Swal.fire("¡Venta registrada!", "El pedido se guardó en el historial.", "success");
        }
    });
});

function renderizarHistorial() {
    if (historialVentas.length === 0) return;
    
    contenedorHistorial.innerHTML = "";
    historialVentas.forEach((venta, i) => {
        contenedorHistorial.innerHTML += `
            <div class="border-bottom mb-2">
                <small class="text-muted">${venta.hora}</small>
                <p>Venta #${i + 1} - Total: $${totalPedidoTxt.innerText}</p>
            </div>
        `;
    });
}

document.getElementById("timeDate").textContent = fechaLegible;

// boton cierre de dia

const btnCerrar = document.getElementById("btnCerrarDia");

if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
        Swal.fire({
            title: "¿Deseas cerrar el día?",
            text: "Se guardará el resumen de ventas actual.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cerrar caja",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("¡Cerrado!", "El día ha sido finalizado con éxito.", "success");
            }
        });
    });
}