import { login } from "./auth.js";


const form = document.getElementById("loginForm");
const mensajeEmail = document.getElementById("emailError");
const mensajePass = document.getElementById("passwordError");
const btnLogin = document.querySelector(".black-btn");

const btnRegister = document.querySelector(".white-btn");

btnRegister.addEventListener("click", () => {
  window.location.href = "register.html";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // limpiar errores
  mensajeEmail.textContent = "";
  mensajePass.textContent = "";

  const email = document.getElementById("email").value;
  const contraseña = document.getElementById("password").value;

  // Cambiar botón a "Cargando..."
  btnLogin.textContent = "Cargando...";
  btnLogin.disabled = true;
  btnLogin.classList.add("loading");

  const resultado = await login(email, contraseña);

  if (resultado.ok) {
    window.location.href = "home.html";
  } else {
    // Mostrar error SOLO debajo del campo contraseña
    mensajePass.textContent = resultado.msg;
    mensajePass.style.color = "red";

    // Restaurar botón
    btnLogin.textContent = "INICIAR SESIÓN";
    btnLogin.disabled = false;
    btnLogin.classList.remove("loading");
  }
});


