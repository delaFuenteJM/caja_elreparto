// Ruta a tu archivo JSON.
const JSON_URL = '../data/productos.json';

// Función principal para cargar datos y renderizar el select
function renderizarProductos() {
    // 1. Seleccionar el elemento SELECT por su ID
    const selectElement = document.getElementById('productos-select');
    
    // Si no se encuentra el select, salimos de la función
    if (!selectElement) {
        console.error("Error: No se encontró el elemento <select> con el ID 'productos-select'.");
        return;
    }

    // 2. Usar fetch para obtener el archivo JSON
    fetch(JSON_URL)
        .then(response => {
            // Verificar si la petición fue exitosa (código 200-299)
            if (!response.ok) {
                // Si hay un error de red o de archivo no encontrado (ej: 404)
                throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`);
            }
            // 3. Convertir el cuerpo de la respuesta a un objeto JavaScript (Array)
            return response.json();
        })
        .then(productos => {
            // 4. Recorrer el array de productos y crear las opciones
            productos.forEach(producto => {
                const option = document.createElement('option');
                
                // El valor interno que se enviará o se usará para cálculos.
                // Aquí usamos el peso en gramos, que mencionaste querer usar después.
                option.value = producto.peso_unitario_gramos;
                
                // El texto que verá el usuario en el desplegable.
                option.textContent = `${producto.nombre} ($${producto.precio})`;
                
                // Añadir la opción al select
                selectElement.appendChild(option);
            });
            console.log("Productos cargados y renderizados correctamente.");
        })
        .catch(error => {
            // Manejar cualquier error que ocurra durante el fetch o la conversión
            console.error('Hubo un problema con la operación fetch:', error);
        });
}

// Llamar a la función para iniciar el proceso
renderizarProductos();

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
