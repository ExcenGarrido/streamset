// Array con los productos
const productos = [
  {
    id: 1,
    nombre: "Micrófono RGB Pro",
    precio: 194990,
    imagen: "Images/Microfono HyperX Quadcast S RGB Black.jpg",
  },
  {
    id: 2,
    nombre: "Teclado Mecánico RGB",
    precio: 233090,
    imagen: "Images/teclado.png",
  },
  {
    id: 3,
    nombre: "Auricular Inalámbrico Logitech G G733 Black RGB",
    precio: 277903,
    imagen: "Images/auriculares.jpg",
  },
  {
    id: 4,
    nombre: "Pc Intel Gamer Kairos Ultimate i7 12700F 16Gb SSD 480Gb RTX 5070 12GbB",
    precio: 1611350,
    imagen: "Images/pc escritorio.jpg",
  },
  {
    id: 5,
    nombre: "Soporte Intelaid De Escritorio Setup 2 Moni Camara Microfono Luz IT-SDM",
    precio: 157499,
    imagen: "Images/camara setup.jpeg",
  },
];

// Clave para localStorage
const carritoKey = "carrito";
// Carga carrito de localStorage o inicia vacío
let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

// Función para actualizar el contador en el header
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;
  const totalCantidad = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  contador.textContent = totalCantidad;
  contador.style.display = totalCantidad > 0 ? "inline-block" : "none";
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem(carritoKey, JSON.stringify(carrito));
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  const existe = carrito.find((p) => p.id === id);
  if (existe) {
    carrito = carrito.map((p) =>
      p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
    );
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  actualizarContadorCarrito();
  alert(`${producto.nombre} agregado al carrito`);
}

// Mostrar productos en productos.html
function mostrarProductos() {
  const productosContainer = document.getElementById("productos-container");
  if (!productosContainer) return;
  productosContainer.innerHTML = "";
  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio.toLocaleString("es-AR")}</p>
      <button class="btn-neon" data-id="${producto.id}">Agregar al carrito</button>
    `;
    productosContainer.appendChild(card);
  });

  // Evento para botones "Agregar al carrito"
  document.querySelectorAll(".btn-neon").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      agregarAlCarrito(id);
    });
  });
}

// Mostrar carrito en carrito.html
function cargarCarrito() {
  const carritoContenido = document.getElementById("carrito-contenido");
  const totalCarrito = document.getElementById("total-carrito");
  if (!carritoContenido || !totalCarrito) return;

  if (carrito.length === 0) {
    carritoContenido.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalCarrito.textContent = "Total: $0";
    actualizarContadorCarrito();
    return;
  }

  let html = `
    <table class="tabla-carrito" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 1px solid #00ffae;">
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
  `;

  let total = 0;
  carrito.forEach((producto, index) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;
    html += `
      <tr>
        <td style="padding: 10px;">
          <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 60px; vertical-align: middle; margin-right: 10px;">
          ${producto.nombre}
        </td>
        <td style="text-align: center;">$${producto.precio.toLocaleString()}</td>
        <td style="text-align: center;">
          <input type="number" min="1" value="${producto.cantidad}" data-index="${index}" class="cantidad-input" style="width: 50px; text-align: center;">
        </td>
        <td style="text-align: center;">$${subtotal.toLocaleString()}</td>
        <td style="text-align: center;">
          <button data-index="${index}" class="btn-eliminar" style="background-color: #ff0000; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 5px;">Eliminar</button>
        </td>
      </tr>
    `;
  });

  html += "</tbody></table>";

  carritoContenido.innerHTML = html;
  totalCarrito.textContent = `Total: $${total.toLocaleString()}`;

  // Cambiar cantidad
  document.querySelectorAll(".cantidad-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = e.target.getAttribute("data-index");
      let nuevaCantidad = parseInt(e.target.value);
      if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
        nuevaCantidad = carrito[index].cantidad;
        e.target.value = nuevaCantidad;
      }
      carrito[index].cantidad = nuevaCantidad;
      guardarCarrito();
      cargarCarrito();
      actualizarContadorCarrito();
    });
  });

  // Eliminar producto
  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      carrito.splice(index, 1);
      guardarCarrito();
      cargarCarrito();
      actualizarContadorCarrito();
    });
  });
}

// Ejecutar al cargar página
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("productos.html")) {
    mostrarProductos();
    actualizarContadorCarrito();
  } else if (window.location.pathname.includes("carrito.html")) {
    cargarCarrito();
  } else {
    actualizarContadorCarrito();
  }
});
