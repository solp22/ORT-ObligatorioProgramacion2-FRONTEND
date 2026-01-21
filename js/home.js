// -------- CARGA DESDE API --------

let productos = [];

async function cargarProductos() {
  try {
    const resp = await fetch("https://ort-obligatorioprogramacion2-backend.onrender.com/producto");
    productos = await resp.json();
    destacados();
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

cargarProductos();


// -------- DESTACADOS --------

function mostrarProductos(productos) {
  let contenedor = document.querySelector(".destacados-grid");
  contenedor.innerHTML = '';
  for (let producto of productos) {
    contenedor.innerHTML += `
    <article>
      <a href="ampliacion.html?id=${producto._id}">  
        <img src="${producto.imagen}" alt="product">
      </a>
      <p>${producto.nombre}</p>
      <p class="precio">$${producto.precio}</p>
    </article>
    `;
  }
}

function destacados() {
  let productosRandom = [];
  let usados = [];

  while (productosRandom.length < 4 && productos.length > 0) {
    let numeroRandom = Math.floor(Math.random() * productos.length);
    if (!usados.includes(numeroRandom)) {
      usados.push(numeroRandom);
      productosRandom.push(productos[numeroRandom]);
    }
  }

  mostrarProductos(productosRandom);
}


// -------- SLIDER --------

let slider = document.querySelector(".slider");
let slides = document.querySelectorAll(".slide");
let indice = 0;
let intervalo;

function actualizarSlider() {
  slider.style.transform = `translateX(-${indice * 100}%)`;
}

function retroceder() {
  indice = (indice - 1 + slides.length) % slides.length;
  actualizarSlider();
}

function avanzar() {
  indice = (indice + 1) % slides.length;
  actualizarSlider();
}

function iniciarSlider() {
  intervalo = setInterval(avanzar, 3000);
}

function pausarSlider() {
  clearInterval(intervalo);
}

document.querySelector("#anterior").addEventListener("click", retroceder);
document.querySelector("#siguiente").addEventListener("click", avanzar);

document.querySelector(".slider-container").addEventListener("mouseenter", pausarSlider);
document.querySelector(".slider-container").addEventListener("mouseleave", iniciarSlider);

actualizarSlider();
iniciarSlider();

