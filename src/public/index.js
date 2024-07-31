/* Cliente */
console.log("Hola desde el server");

const SOCKET = io();
const FORM = document.getElementById("form");

// esto es para escuchar un mensaje
SOCKET.on("connection", () => {
  console.log("Conectado al Server");
});

// esto es para escuchar un mensaje
SOCKET.on("products", (products) => {
  const TBODY = document.getElementById("tbody");
  TBODY.innerHTML = ""; // Limpiar contenido anterior

  let rowsHTML = ""; // Variable para acumular todas las filas

  // Verificar que products.docs sea un array válido
  if (
    products &&
    products.productsFound &&
    Array.isArray(products.productsFound.docs)
  ) {
    products.productsFound.docs.forEach((product) => {
      rowsHTML += `
                <tr class="categories__item">
                    <td class="category update" id="${product._id}">${product.category}</td>
                    <td class="name update" id="${product._id}">${product.name}</td>
                    <td class="thumbnail update" id="${product._id}"><a href="${product.thumbnail[0]}" target="_blank">${product.thumbnail[0]}</a></td>
                    <td class="price update" id="${product._id}">${product.price}</td>
                    <td class="stock update" id="${product._id}">${product.stock}</td>
                  
                </tr>
            `;
    });
  } else {
    console.log("Received products is null or not an array", products);
  }

  // Establecer el contenido HTML una vez construido
  TBODY.innerHTML = rowsHTML;

  // Configurar event listeners para los botones de editar y eliminar
  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("id");
      SOCKET.emit("delete-product", productId);
    });
  });
});

FORM.addEventListener("submit", function (event) {
  event.preventDefault();
  // obtener valores del formulario
  const FILE = document.getElementById("file").value;
  const CATEGORY = document.getElementById("category").value;
  const TITLE = document.getElementById("name").value;
  const PRICE = document.getElementById("price").value;
  const STOCK = document.getElementById("stock").value;
  const DESCRIPTION = document.getElementById("description").value;
  // enviar el nuevo producto al servidor a traves de socket
  const product = {
    category: CATEGORY,
    name: TITLE,
    description: DESCRIPTION,
    price: Number(PRICE),
    stock: Number(STOCK),
    thumbnail: [FILE],
  };
  console.log(FILE);
  SOCKET.emit("add-product", product);
  FORM.reset();
});

// esto aparece al desconectar el servidor (control+C).
SOCKET.on("disconnect", () => {
  console.log("Se desconecto el server");
});
