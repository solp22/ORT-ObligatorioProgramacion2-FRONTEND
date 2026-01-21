const localhost = "https://ort-obligatorioprogramacion2-backend.onrender.com";

export function login(email, contraseña) {
  return fetch(localhost + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contraseña })
  })
    .then(async (res) => {
      const data = await res.json();
      
      if (!res.ok) {
        return { ok: false, msg: data.error };
      }

      return { ok: true, usuario: data.usuario };
    })
    .catch(err => {
      return { ok: false, msg: "Error de red o servidor: " + err };
    });
}

export function register(email, contraseña) {
  return fetch(localhost + "/usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contraseña })
  })
    .then(async (res) => {
      const data = await res.json();
      
      if (!res.ok) {
        return { ok: false, msg: data.error };
      }

      return { ok: true, usuario: data.usuario };
    })
    .catch(err => {
      return { ok: false, msg: "Error de red o servidor: " + err };
    });
  }