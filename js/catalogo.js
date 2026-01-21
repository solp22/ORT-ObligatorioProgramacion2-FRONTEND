let searchBar = document.querySelector("#searchBar");
let selectFiltros = document.querySelector("#slcTipos");


let productos = [];  // ahora esto viene de la API

// --- CARGAR DESDE LA API ---
async function cargarProductos() {
  try {
    const res = await fetch("https://ort-obligatorioprogramacion2-backend.onrender.com/producto");
    productos = await res.json();
     if (tipoDesdeURL) {
      selectFiltros.value = tipoDesdeURL;
      filtrarTipos();
    } 
    // si no vino nada, mostrar todo
    else {
      mostrarProductos(productos);
    }

  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

cargarProductos();


function mostrarProductos(productos) {
  let contenedor = document.querySelector(".product-grid");
  contenedor.innerHTML = '';
  for (let producto of productos) {
    contenedor.innerHTML += `
    <div class="product-card">
    <a href="ampliacion.html?id=${producto._id}">  
    <img src="${producto.imagen}" alt="product" class="product-image">
    </a>
    <div class="product-info">
    <h2 class="product-title">${producto.nombre}</h2>
    <p class="product-price">$${producto.precio}</p>
    </div>
    </div>
    `;
  }
}

mostrarProductos(productos)

// -------- FILTRO SEARCHBAR --------
searchBar.addEventListener("input", filtrarProductos)

function filtrarProductos() {
  let texto = searchBar.value.toLowerCase();
  let productosFiltrados = [];

  for (let producto of productos) {
    let nombre = producto.nombre.toLowerCase();
    if (nombre.includes(texto)) {
      productosFiltrados.push(producto)
    }
  }

  mostrarProductos(productosFiltrados)
}

// -------- FILTRO SELECT --------
selectFiltros.addEventListener("change", filtrarTipos)

function filtrarTipos(){
  let tipo = selectFiltros.value
  let tiposFiltrados = [];

  for (let producto of productos) {
    if (producto.type === tipo) {
      tiposFiltrados.push(producto)
    }
}

 mostrarProductos(tiposFiltrados)

}

// -------- FILTRO CON PARAMETROS --------
const parametros = new URLSearchParams(window.location.search);
const tipoDesdeURL = parametros.get('type');

cargarProductos();
