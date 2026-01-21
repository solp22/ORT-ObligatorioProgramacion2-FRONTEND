import { register } from "./auth.js";
const regForm = document.querySelector("#register-form");

regForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const contraseña = document.querySelector("#password").value;

  const res = await register( email, contraseña);

  if (res.ok) {
    mostrarPopup();
  } else {
    alert(res.msg);
  }
});

function mostrarPopup(redireccion = "login.html") {
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");

  const btn = document.getElementById("popupBtn");

  btn.onclick = () => {
    popup.classList.add("hidden");
    window.location.href = redireccion;
  };
}
