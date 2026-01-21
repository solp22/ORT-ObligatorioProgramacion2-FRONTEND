// ---------------------------------------------
// CONFIG
// ---------------------------------------------



const API_URL = "https://ort-obligatorioprogramacion2-backend.onrender.com/producto";

let parametros = new URLSearchParams(window.location.search);
let identificador = parametros.get("id");

let producto = null;
let productos = [];


// ---------------------------------------------
// CARGAR PRODUCTO DESDE API
// ---------------------------------------------

async function cargarProducto() {
  try {
    const res = await fetch(API_URL);
    productos = await res.json();
    producto = productos.find(p => String(p._id) === identificador);

    if (!producto) {
      console.error("Producto no encontrado");
      return;
    }

    cargarDatosProducto();
    configurarSelect();
    mostrarMiniaturas();
    tiposSugerencia();

  } catch (err) {
    console.error("Error cargando producto:", err);
  }
}

cargarProducto();


// ---------------------------------------------
// CARGAR INFO EN PANTALLA
// ---------------------------------------------

function cargarDatosProducto() {
  document.querySelector("#nombre").textContent = producto.nombre;
  document.querySelector("#imagen").src = producto.imagen;
  document.querySelector("#precioProd").textContent = `$${producto.precio}`;
  document.querySelector("#descripcion").textContent = producto.descripcion;

  document.querySelector("#min").src = producto.imagen;
  document.querySelector("#min1").src = producto.miniaturas?.[0] ?? producto.imagen;
  document.querySelector("#min2").src = producto.miniaturas?.[1] ?? producto.imagen;
}


// ---------------------------------------------
// SELECT SEGÚN TIPO
// ---------------------------------------------

function configurarSelect() {
  let select = document.querySelector("#selectProd");

  if (producto.type !== "Bolsos" && producto.type !== "Sombreros" && producto.type !== "Zapatos" && producto.type !== "Joyas") {
    select.innerHTML = `
      <option value="" disabled selected>Seleccione una talla</option>
      <option value="XS">XS</option>
      <option value="S">S</option>
      <option value="M">M</option>
      <option value="L">L</option>
      <option value="XL">XL</option>`;
  }

  else if (producto.type === "Zapatos") {
    select.innerHTML = `
      <option value="" disabled selected>Seleccione una talla</option>
      <option value="35">35</option>
      <option value="36">36</option>
      <option value="37">37</option>
      <option value="38">38</option>
      <option value="39">39</option>`;
  }

  else {
    select.innerHTML = `
      <option value="" disabled selected>Seleccione un color</option>
      <option value="azul">Azul</option>
      <option value="rosado">Rosado</option>
      <option value="amarillo">Amarillo</option>
      <option value="celeste">Celeste</option>
      <option value="beige">Beige</option>`;
  }
}


// ---------------------------------------------
// MINIATURAS
// ---------------------------------------------

function mostrarMiniaturas() {
  let imagenPrincipal = document.getElementById("imagen");
  let miniaturas = document.querySelectorAll(".miniatura");

  miniaturas.forEach(min => {
    min.addEventListener("click", function () {
      imagenPrincipal.src = this.src;
    });
  });
}


// ---------------------------------------------
// SUGERENCIAS
// ---------------------------------------------

function mostrarProductos(productos) {
  let contenedor = document.querySelector(".sugerencia-grid");
  contenedor.innerHTML = '';

  for (let p of productos) {
    contenedor.innerHTML += `
      <article>
        <a href="ampliacion.html?id=${p._id}">
          <img src="${p.imagen}" alt="product">
        </a>
        <p>${p.nombre}</p>
      </article>
    `;
  }
}

function tiposSugerencia() {
  let tipo = producto.type;

  // productos del mismo tipo, excepto el mismo producto
  let tiposIguales = productos.filter(p =>
    p.type === tipo && String(p._id) !== String(producto._id)
  );

  // si hay pocos, agregamos random
  while (tiposIguales.length < 3) {
    let random = productos[Math.floor(Math.random() * productos.length)];
    if (!tiposIguales.includes(random)) {
      tiposIguales.push(random);
    }
  }

  mostrarProductos(tiposIguales.slice(0, 3));
}


// ---------------------------------------------
// MODAL
// ---------------------------------------------

let openModalBtn = document.querySelector(".open-modal-btn");
let modalContainer = document.querySelector(".modal-container");
let closeBtn = document.querySelector(".close-btn");


function handleCloseModal() {
  modalContainer.classList.remove("active");
}

function handleOutsideClick(event) {
  if (event.target === modalContainer) {
    handleCloseModal();
  }
}

closeBtn.addEventListener("click", handleCloseModal);
modalContainer.addEventListener("click", handleOutsideClick);

async function obtenerCarrito() {
  const res = await fetch("https://ort-obligatorioprogramacion2-backend.onrender.com/carrito");
  return await res.json(); 
}

async function guardarCarrito(itemsActualizados) {
  return await fetch("https://ort-obligatorioprogramacion2-backend.onrender.com/carrito", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: itemsActualizados })
  });
}

async function agregarAlCarrito() {

  let tallaSeleccionada = document.querySelector("#selectProd").value;

  if (!tallaSeleccionada) {
  mostrarPopupTalla();
    return false;
  }

  try {
    const carrito = await obtenerCarrito();
    let items = carrito.items || [];

    let encontrado = items.find(
      i => i._id === producto._id && i.talla === tallaSeleccionada
    );

    if (encontrado) {
      encontrado.cantidad += 1;
    } else {
      items.push({
        _id: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1,
        talla: tallaSeleccionada,
        type: producto.type 
      });
    }

    const res = await guardarCarrito(items);

    if (!res.ok) {
      console.error("Error guardando carrito:", await res.text());
      return false;
    }

    return true;

  } catch (err) {
    console.error("Error al agregar al carrito:", err);
    return false;
  }
}

openModalBtn.addEventListener("click", async () => {
  const ok = await agregarAlCarrito();
  if (ok) modalContainer.classList.add("active");
});


function mostrarPopupTalla() {
  const popup = document.getElementById("popup-talla");
  popup.classList.remove("hidden");

  document.getElementById("popup-talla-btn").onclick = () => {
    popup.classList.add("hidden");
  };
}
