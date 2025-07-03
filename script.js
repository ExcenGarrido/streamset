// URL de la API dummyjson
const API_URL = "https://dummyjson.com/products?limit=10";

// Clave para localStorage
const carritoKey = "carrito";

// Carga carrito desde localStorage o lo inicia vacío
let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

// Actualiza el contador del carrito en el header
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;
  const totalCantidad = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  contador.textContent = totalCantidad;
  contador.style.display = totalCantidad > 0 ? "inline-block" : "none";
}

// Guarda el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem(carritoKey, JSON.stringify(carrito));
}

// Agrega un producto al carrito
function agregarAlCarrito(producto) {
  const existe = carrito.find((p) => p.id === producto.id);
  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  actualizarContadorCarrito();
  alert(`${producto.title} agregado al carrito`);
}

// Carga productos desde la API y los muestra en productos.html
function cargarProductosDesdeAPI() {
  const container = document.getElementById("productos-container");
  if (!container) return;

  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      container.innerHTML = "";
      data.products.forEach((producto) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${producto.thumbnail}" alt="${producto.title}" />
          <h3>${producto.title}</h3>
          <p>$${producto.price.toLocaleString("es-AR")}</p>
          <button class="btn-neon" data-id="${producto.id}">Agregar al carrito</button>
        `;
        container.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
          agregarAlCarrito({
            id: producto.id,
            title: producto.title,
            price: producto.price,
            thumbnail: producto.thumbnail,
          });
        });
      });
    })
    .catch((err) => {
      container.innerHTML = "<p>Error al cargar los productos.</p>";
      console.error("Error al cargar productos:", err);
    });
}

// Muestra los productos del carrito en carrito.html
function cargarCarrito() {
  const contenedor = document.getElementById("carrito-contenido");
  const total = document.getElementById("total-carrito");
  const btnVaciar = document.getElementById("btn-vaciar");
  const btnFinalizar = document.getElementById("btn-finalizar");

  if (!contenedor || !total) return;

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
    total.textContent = "Total: $0";
    return;
  }

  let html = `
    <table class="tabla-carrito">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
  `;

  let suma = 0;
  carrito.forEach((p, index) => {
    const subtotal = p.price * p.cantidad;
    suma += subtotal;
    html += `
      <tr>
        <td><img src="${p.thumbnail}" style="width:50px;vertical-align:middle;"> ${p.title}</td>
        <td>$${p.price.toLocaleString()}</td>
        <td><input type="number" value="${p.cantidad}" min="1" data-index="${index}" class="cantidad-input"></td>
        <td>$${subtotal.toLocaleString()}</td>
        <td><button data-index="${index}" class="btn-eliminar">❌</button></td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  contenedor.innerHTML = html;
  total.textContent = `Total: $${suma.toLocaleString("es-AR")}`;

  // Actualizar cantidades
  document.querySelectorAll(".cantidad-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const i = e.target.dataset.index;
      const nuevaCantidad = Math.max(1, parseInt(e.target.value));
      carrito[i].cantidad = nuevaCantidad;
      guardarCarrito();
      cargarCarrito();
    });
  });

  // Eliminar productos
  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = e.target.dataset.index;
      carrito.splice(i, 1);
      guardarCarrito();
      cargarCarrito();
      actualizarContadorCarrito();
    });
  });

  // Vaciar carrito
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      localStorage.removeItem(carritoKey);
      carrito = [];
      cargarCarrito();
      actualizarContadorCarrito();
    });
  }

  // Finalizar compra
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      localStorage.removeItem(carritoKey);
      carrito = [];
      alert("¡Gracias por tu compra!");
      window.location.href = "index.html";
    });
  }
}

// Inicializador
document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.includes("productos.html")) {
    cargarProductosDesdeAPI();
  } else if (location.pathname.includes("carrito.html")) {
    cargarCarrito();
  }
  actualizarContadorCarrito();
});
