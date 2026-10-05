// ================== CONFIGURACIÓN DE NIVELES ==================
const niveles = {
  1: {
    nombre: "Nivel 1 - Fácil",
    objetoInicio: { x: 40, y: 40 },
    meta: { x: 700, y: 500 },
    paredes: [
      // Bordes externos
      { top: 0, left: 0, width: 800, height: 20 },
      { top: 0, left: 0, width: 20, height: 600 },
      { top: 0, left: 780, width: 20, height: 600 },
      { top: 580, left: 0, width: 800, height: 20 },
      // Paredes internas simples
      { top: 100, left: 200, width: 20, height: 300 },
      { top: 400, left: 200, width: 300, height: 20 },
      { top: 100, left: 500, width: 20, height: 320 },
      { top: 100, left: 500, width: 200, height: 20 }
    ]
  },
  2: {
    nombre: "Nivel 2 - Medio",
    objetoInicio: { x: 40, y: 40 },
    meta: { x: 700, y: 500 },
    paredes: [
      // Bordes
      { top: 0, left: 0, width: 800, height: 20 },
      { top: 0, left: 0, width: 20, height: 600 },
      { top: 0, left: 780, width: 20, height: 600 },
      { top: 580, left: 0, width: 800, height: 20 },
      // Laberinto medio
      { top: 20, left: 140, width: 20, height: 180 },
      { top: 180, left: 140, width: 200, height: 20 },
      { top: 20, left: 420, width: 20, height: 140 },
      { top: 140, left: 420, width: 180, height: 20 },
      { top: 20, left: 660, width: 20, height: 220 },
      { top: 260, left: 20, width: 160, height: 20 },
      { top: 260, left: 160, width: 20, height: 160 },
      { top: 400, left: 20, width: 160, height: 20 },
      { top: 260, left: 340, width: 20, height: 180 },
      { top: 420, left: 340, width: 200, height: 20 },
      { top: 300, left: 540, width: 20, height: 160 },
      { top: 480, left: 20, width: 100, height: 20 },
      { top: 480, left: 240, width: 20, height: 100 },
      { top: 480, left: 440, width: 20, height: 100 }
    ]
  },
  3: {
    nombre: "Nivel 3 - Difícil",
    objetoInicio: { x: 40, y: 40 },
    meta: { x: 700, y: 500 },
    paredes: [
      // Bordes
      { top: 0, left: 0, width: 800, height: 20 },
      { top: 0, left: 0, width: 20, height: 600 },
      { top: 0, left: 780, width: 20, height: 600 },
      { top: 580, left: 0, width: 800, height: 20 },
      // Laberinto complejo con zigzag
      { top: 20, left: 100, width: 20, height: 200 },
      { top: 200, left: 100, width: 160, height: 20 },
      { top: 20, left: 320, width: 20, height: 140 },
      { top: 140, left: 320, width: 180, height: 20 },
      { top: 20, left: 560, width: 20, height: 220 },
      { top: 240, left: 560, width: 200, height: 20 },
      { top: 240, left: 100, width: 20, height: 160 },
      { top: 380, left: 100, width: 140, height: 20 },
      { top: 260, left: 240, width: 20, height: 200 },
      { top: 440, left: 240, width: 120, height: 20 },
      { top: 300, left: 360, width: 20, height: 140 },
      { top: 300, left: 360, width: 160, height: 20 },
      { top: 380, left: 500, width: 20, height: 180 },
      { top: 480, left: 380, width: 140, height: 20 },
      { top: 480, left: 620, width: 20, height: 100 },
      { top: 480, left: 620, width: 140, height: 20 }
    ]
  }
};

// ================== VARIABLES GLOBALES ==================
const laberinto = document.getElementById("laberinto");
const objeto = document.getElementById("objeto");
const meta = document.getElementById("meta");
const tituloNivel = document.getElementById("titulo-nivel");
const pantallaMenu = document.getElementById("menu");
const pantallaJuego = document.getElementById("juego");
const pantallaPerdiste = document.getElementById("perdiste");
const pantallaGanaste = document.getElementById("ganaste");
const btnSiguiente = document.getElementById("btn-siguiente");
const mensajeGanaste = document.getElementById("mensaje-ganaste");

let nivelActual = 1;
let arrastrando = false;
let offsetX = 0, offsetY = 0;
let posX = 40, posY = 40;
let paredesActuales = [];

const TOLERANCIA = 6; // margen para que la colisión sea justa

// ================== INICIAR NIVEL ==================
function iniciarNivel(nivel) {
  nivelActual = nivel;
  const config = niveles[nivel];

  // Ocultar pantallas
  pantallaMenu.classList.add("oculto");
  pantallaPerdiste.classList.add("oculto");
  pantallaGanaste.classList.add("oculto");
  pantallaJuego.classList.remove("oculto");

  // Título
  tituloNivel.textContent = config.nombre;

  // Limpiar paredes anteriores
  document.querySelectorAll(".pared").forEach(p => p.remove());
  paredesActuales = [];

  // Crear paredes
  config.paredes.forEach(p => {
    const div = document.createElement("div");
    div.className = "pared";
    div.style.top = p.top + "px";
    div.style.left = p.left + "px";
    div.style.width = p.width + "px";
    div.style.height = p.height + "px";
    laberinto.appendChild(div);
    paredesActuales.push(div);
  });

  // Posicionar meta
  meta.style.top = config.meta.y + "px";
  meta.style.left = config.meta.x + "px";

  // Posicionar objeto
  posX = config.objetoInicio.x;
  posY = config.objetoInicio.y;
  objeto.style.left = posX + "px";
  objeto.style.top = posY + "px";

  // Configurar botón siguiente nivel
  if (nivel < 3) {
    btnSiguiente.style.display = "inline-block";
  } else {
    btnSiguiente.style.display = "none";
    mensajeGanaste.textContent = "¡Completaste todos los niveles! 🏆";
  }
}

// ================== REINICIAR NIVEL ==================
function reiniciarNivel() {
  iniciarNivel(nivelActual);
}

// ================== SIGUIENTE NIVEL ==================
function siguienteNivel() {
  if (nivelActual < 3) {
    iniciarNivel(nivelActual + 1);
  }
}

// ================== VOLVER AL MENÚ ==================
function volverAlMenu() {
  pantallaJuego.classList.add("oculto");
  pantallaPerdiste.classList.add("oculto");
  pantallaGanaste.classList.add("oculto");
  pantallaMenu.classList.remove("oculto");
}

// ================== EVENTOS DE ARRASTRE ==================
objeto.addEventListener("mousedown", iniciarArrastre);
document.addEventListener("mousemove", mover);
document.addEventListener("mouseup", soltar);

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
  const escalaX = laberinto.clientWidth / rectLab.width;
  const escalaY = laberinto.clientHeight / rectLab.height;

  posX = (clientX - rectLab.left) * escalaX - offsetX;
  posY = (clientY - rectLab.top) * escalaY - offsetY;

  // Limitar dentro del laberinto
  posX = Math.max(0, Math.min(posX, laberinto.clientWidth - objeto.offsetWidth));
  posY = Math.max(0, Math.min(posY, laberinto.clientHeight - objeto.offsetHeight));

  objeto.style.left = posX + "px";
  objeto.style.top = posY + "px";

  verificarColision();
}

function soltar() {
  if (!arrastrando) return;
  arrastrando = false;
  verificarMeta();
}

// ================== COLISIONES ==================
function verificarColision() {
  const oLeft = posX + TOLERANCIA;
  const oRight = posX + objeto.offsetWidth - TOLERANCIA;
  const oTop = posY + TOLERANCIA;
  const oBottom = posY + objeto.offsetHeight - TOLERANCIA;

  for (const pared of paredesActuales) {
    const pLeft = parseFloat(pared.style.left) || 0;
    const pTop = parseFloat(pared.style.top) || 0;
    const pWidth = parseFloat(pared.style.width) || 0;
    const pHeight = parseFloat(pared.style.height) || 0;
    const pRight = pLeft + pWidth;
    const pBottom = pTop + pHeight;

    if (oLeft < pRight && oRight > pLeft && oTop < pBottom && oBottom > pTop) {
      perder();
      return;
    }
  }
}

function verificarMeta() {
  const oLeft = posX;
  const oRight = posX + objeto.offsetWidth;
  const oTop = posY;
  const oBottom = posY + objeto.offsetHeight;

  const mLeft = parseFloat(meta.style.left) || 0;
  const mTop = parseFloat(meta.style.top) || 0;
  const mRight = mLeft + meta.offsetWidth;
  const mBottom = mTop + meta.offsetHeight;

  if (oLeft < mRight && oRight > mLeft && oTop < mBottom && oBottom > mTop) {
    ganar();
  }
}

// ================== RESULTADOS ==================
function perder() {
  arrastrando = false;
  pantallaPerdiste.classList.remove("oculto");
}

function ganar() {
  arrastrando = false;
  pantallaGanaste.classList.remove("oculto");
}
