// ---------------------------------------------
// API DEL CARRITO REAL
// ---------------------------------------------

async function getCarrito() {
  const res = await fetch("https://ort-obligatorioprogramacion2-backend.onrender.com/carrito");
  return await res.json();
}

async function updateCarrito(items) {
  return await fetch("https://ort-obligatorioprogramacion2-backend.onrender.com/carrito", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  });
}

async function deleteCarrito() {
  return await fetch("https://ort-obligatorioprogramacion2-backend.onrender.com/carrito", {
    method: "DELETE"
  });
}

// ---------------------------------------------
// ELEMENTOS DEL DOM
// ---------------------------------------------

const cartList = document.getElementById("cartList");
const itemsCount = document.getElementById("itemsCount");
const subtotalVal = document.getElementById("subtotalVal");
const shippingVal = document.getElementById("shippingVal");
const totalVal = document.getElementById("totalVal");

let cart = [];

// ---------------------------------------------
// CARGAR CARRITO DESDE API
// ---------------------------------------------

async function cargarCarrito() {
  const carrito = await getCarrito();

  cart = carrito.items.map((i) => ({
    ...i,
    qty: i.cantidad,
  }));

  renderCart();
}

// ---------------------------------------------
// RENDER DEL CARRITO
// ---------------------------------------------

function renderCart() {
  cartList.innerHTML = "";
  let subtotal = 0;

  cart.forEach((p, idx) => {
    subtotal += p.precio * p.qty;

    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div class="thumb"><img src="${p.imagen}" alt=""></div>

      <div class="info">
        <h3>${p.nombre}</h3>
        <p>${p.talla}</p>
      </div>

      <div class="qty">
        <button data-action="dec" data-idx="${idx}">-</button>
        <span>${p.qty}</span>
        <button data-action="inc" data-idx="${idx}">+</button>
      </div>

      <div class="price">$${p.precio * p.qty}</div>

     <div class="edit" data-edit="${idx}" title="Editar talla">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
       viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" 
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
  </svg>
</div>


    <div class="remove" data-remove="${idx}" title="Eliminar">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
       viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" 
       stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4
             a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
</div>

    `;

    cartList.appendChild(item);
  });

  itemsCount.textContent = cart.reduce((s, i) => s + i.qty, 0);

  subtotalVal.textContent = `$${subtotal.toLocaleString()}`;
  const shipping = cart.length ? 4 : 0;
  shippingVal.textContent = `$${shipping}`;
  totalVal.textContent = `$${(subtotal + shipping).toLocaleString()}`;

  renderTicket();
}

// ---------------------------------------------
// RENDER TICKET A LA DERECHA
// ---------------------------------------------

function renderTicket() {
  const ticket = document.getElementById("ticket-list");
  ticket.innerHTML = "";

  cart.forEach((p) => {
    const line = document.createElement("p");
    line.innerHTML = `${p.qty} x ${p.nombre} <span>$${(
      p.precio * p.qty
    ).toLocaleString()}</span>`;
    ticket.appendChild(line);
  });
}

// ---------------------------------------------
// EVENTOS: EDITAR, SUMAR, RESTAR, ELIMINAR
// ---------------------------------------------

cartList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (btn) {
    const idx = Number(btn.dataset.idx);
    const action = btn.dataset.action;

    if (action === "inc") cart[idx].qty++;
    if (action === "dec") cart[idx].qty = Math.max(1, cart[idx].qty - 1);

    await updateCarrito(
      cart.map((item) => ({ ...item, cantidad: item.qty }))
    );

    renderCart();
    return;
  }

  // ELIMINAR
  const rem = e.target.closest("[data-remove]");
  if (rem) {
    const idx = Number(rem.dataset.remove);
    cart.splice(idx, 1);

    await updateCarrito(
      cart.map((item) => ({ ...item, cantidad: item.qty }))
    );

    renderCart();
    return;
  }

  // EDITAR TALLA
  const edit = e.target.closest("[data-edit]");
  if (edit) {
    const idx = Number(edit.dataset.edit);
    abrirPopupEdicion(idx);
  }
});

// ---------------------------------------------
// POPUP DE EDITAR TALLA
// ---------------------------------------------

function abrirPopupEdicion(idx) {
  const popup = document.getElementById("edit-popup");
  const select = document.getElementById("edit-select");

  const producto = cart[idx];

  let opciones = "";

  // -----------------------------
  // SEGÚN TIPO DE PRODUCTO
  // -----------------------------
  if (producto.type === "Zapatos") {
    opciones = `
      <option value="35">35</option>
      <option value="36">36</option>
      <option value="37">37</option>
      <option value="38">38</option>
      <option value="39">39</option>
    `;
  }

  else if (producto.type === "Bolsos" || producto.type === "Sombreros" || producto.type === "Joyas") {
    opciones = `
      <option value="azul">Azul</option>
      <option value="rosado">Rosado</option>
      <option value="amarillo">Amarillo</option>
      <option value="celeste">Celeste</option>
      <option value="beige">Beige</option>
    `;
  }

  else {
    // Ropa → talles normales
    opciones = `
      <option value="XS">XS</option>
      <option value="S">S</option>
      <option value="M">M</option>
      <option value="L">L</option>
      <option value="XL">XL</option>
    `;
  }

  // Insertar opciones en el <select>
  select.innerHTML = opciones;

  // Seleccionar la talla actual del producto
  select.value = producto.talla;

  window.productoEditando = idx;

  popup.classList.remove("hidden");
}


document.getElementById("edit-confirm").addEventListener("click", async () => {
  const nuevaTalla = document.getElementById("edit-select").value;
  const idx = window.productoEditando;

  cart[idx].talla = nuevaTalla;

  await updateCarrito(
    cart.map((i) => ({ ...i, cantidad: i.qty }))
  );

  document.getElementById("edit-popup").classList.add("hidden");
  renderCart();
});

document.getElementById("edit-cancel").addEventListener("click", () => {
  document.getElementById("edit-popup").classList.add("hidden");
});

// ---------------------------------------------
// POPUP GENERAL (ALERT PERSONALIZADO)
// ---------------------------------------------

function mostrarPopup(mensaje, callback = null) {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");
  const btn = document.getElementById("popup-btn");

  msg.textContent = mensaje;
  popup.classList.remove("hidden");

  btn.onclick = () => {
    popup.classList.add("hidden");
    if (callback) callback();
  };
}

// ---------------------------------------------
// CHECKOUT
// ---------------------------------------------

document.querySelector(".total-btn").addEventListener("click", async () => {
  const res = await deleteCarrito();

  if (res.ok) {
    cart = [];
    renderCart();

    mostrarPopup("Tu compra fue procesada. ¡Gracias!", () => {
      window.location.href = "home.html";
    });
  } else {
    mostrarPopup("Error al procesar el checkout.");
  }
});

// ---------------------------------------------
// INICIAR
// ---------------------------------------------
cargarCarrito();
