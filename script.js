const objeto = document.getElementById("objeto");
const meta = document.getElementById("meta");
const laberinto = document.getElementById("laberinto");
const paredes = document.querySelectorAll(".pared");
const pantallaPerdiste = document.getElementById("perdiste");
const pantallaGanaste = document.getElementById("ganaste");

let arrastrando = false;
let offsetX = 0, offsetY = 0;
let posX = 30, posY = 30; // posición inicial

// Eventos del mouse
objeto.addEventListener("mousedown", iniciarArrastre);
document.addEventListener("mousemove", mover);
document.addEventListener("mouseup", soltar);

// Soporte para táctil (móvil)
objeto.addEventListener("touchstart", iniciarArrastreTouch, { passive: false });
document.addEventListener("touchmove", moverTouch, { passive: false });
document.addEventListener("touchend", soltar);

function iniciarArrastre(e) {
  arrastrando = true;
  const rect = objeto.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
}

function iniciarArrastreTouch(e) {
  e.preventDefault();
  arrastrando = true;
  const rect = objeto.getBoundingClientRect();
  const touch = e.touches[0];
  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;
}

function mover(e) {
  if (!arrastrando) return;
  actualizarPosicion(e.clientX, e.clientY);
}

function moverTouch(e) {
  if (!arrastrando) return;
  e.preventDefault();
  const touch = e.touches[0];
  actualizarPosicion(touch.clientX, touch.clientY);
}

function actualizarPosicion(clientX, clientY) {
  const rectLab = laberinto.getBoundingClientRect();

  posX = clientX - rectLab.left - offsetX;
  posY = clientY - rectLab.top - offsetY;

  objeto.style.left = posX + "px";
  objeto.style.top = posY + "px";

  verificarColision();
}

function soltar() {
  if (!arrastrando) return;
  arrastrando = false;
  verificarMeta();
}

function verificarColision() {
  const objRect = objeto.getBoundingClientRect();

  // Colisión con paredes
  for (const pared of paredes) {
    const pRect = pared.getBoundingClientRect();
    if (
      objRect.left < pRect.right &&
      objRect.right > pRect.left &&
      objRect.top < pRect.bottom &&
      objRect.bottom > pRect.top
    ) {
      perder();
      return;
    }
  }

  // Colisión con bordes del laberinto
  const labRect = laberinto.getBoundingClientRect();
  if (
    objRect.left < labRect.left ||
    objRect.right > labRect.right ||
    objRect.top < labRect.top ||
    objRect.bottom > labRect.bottom
  ) {
    perder();
  }
}

function verificarMeta() {
  const objRect = objeto.getBoundingClientRect();
  const metaRect = meta.getBoundingClientRect();

  if (
    objRect.left < metaRect.right &&
    objRect.right > metaRect.left &&
    objRect.top < metaRect.bottom &&
    objRect.bottom > metaRect.top
  ) {
    ganar();
  }
}

function perder() {
  arrastrando = false;
  pantallaPerdiste.classList.remove("oculto");
}

function ganar() {
  arrastrando = false;
  pantallaGanaste.classList.remove("oculto");
}

function reiniciar() {
  pantallaPerdiste.classList.add("oculto");
  pantallaGanaste.classList.add("oculto");
  posX = 40;
  posY = 240;
  objeto.style.left = posX + "px";
  objeto.style.top = posY + "px";
}
