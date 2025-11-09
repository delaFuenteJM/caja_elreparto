const JSON_URL = '../data/productos.json';

function renderizarProductos() {
    const selectElement = document.getElementById('products-select');
    if (!selectElement) {
        console.error("Error: No se encontró el elemento <select> con el ID 'productos-select'.");
        return;
    }

    fetch(JSON_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(productos => {
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.peso_unitario_gramos;
                option.textContent = `${producto.nombre} ($${producto.precio})`;
                selectElement.appendChild(option);
            });
            console.log("Productos cargados y renderizados correctamente.");
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });
}
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
