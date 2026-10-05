// ================== REFERENCIAS ==================
const menu = document.getElementById("menu");
const juego = document.getElementById("juego");
const pantallaGanador = document.getElementById("ganador");
const textoGanador = document.getElementById("texto-ganador");
const cancha = document.getElementById("cancha");
const paleta1 = document.getElementById("paleta1");
const paleta2 = document.getElementById("paleta2");
const pelota = document.getElementById("pelota");
const puntos1El = document.getElementById("puntos1");
const puntos2El = document.getElementById("puntos2");

// ================== CONFIGURACIÓN ==================
const PUNTOS_PARA_GANAR = 5;
const VELOCIDAD_PALETA = 8;
const VELOCIDAD_PELOTA_INICIAL = 6;
const AUMENTO_VELOCIDAD = 0.3; // se acelera al chocar

// ================== ESTADO ==================
let juegoActivo = false;
let pausado = false;
let puntos1 = 0;
let puntos2 = 0;

// Posiciones de paletas (Y)
let p1Y = 205;
let p2Y = 205;

// Pelota
let pelotaX = 442;
let pelotaY = 242;
let velX = 5;
let velY = 3;

// Teclas presionadas
const teclas = {};

// ================== INICIAR JUEGO ==================
function iniciarJuego() {
  menu.classList.add("oculto");
  pantallaGanador.classList.add("oculto");
  juego.classList.remove("oculto");

  // Reiniciar todo
  puntos1 = 0;
  puntos2 = 0;
  puntos1El.textContent = "0";
  puntos2El.textContent = "0";

  p1Y = (cancha.clientHeight - 90) / 2;
  p2Y = (cancha.clientHeight - 90) / 2;
  paleta1.style.top = p1Y + "px";
  paleta2.style.top = p2Y + "px";

  reiniciarPelota();

  juegoActivo = true;
  pausado = false;
}

function reiniciarPelota() {
  const alturaCancha = cancha.clientHeight;
  const anchoCancha = cancha.clientWidth;

  pelotaX = anchoCancha / 2 - 8;
  pelotaY = alturaCancha / 2 - 8;

  // Dirección aleatoria
  const direccionX = Math.random() < 0.5 ? -1 : 1;
  const direccionY = Math.random() < 0.5 ? -1 : 1;

  velX = VELOCIDAD_PELOTA_INICIAL * direccionX;
  velY = VELOCIDAD_PELOTA_INICIAL * direccionY * 0.6;

  pelota.style.left = pelotaX + "px";
  pelota.style.top = pelotaY + "px";
}

// ================== TECLADO ==================
document.addEventListener("keydown", (e) => {
  teclas[e.key.toLowerCase()] = true;

  // Espacio para pausar
  if (e.key === " " && juegoActivo) {
    e.preventDefault();
    pausado = !pausado;
    if (!pausado) loop();
  }

  // Evitar scroll con flechas
  if (["ArrowUp", "ArrowDown", " "].includes(e.key)) {
    e.preventDefault();
  }
});

document.addEventListener("keyup", (e) => {
  teclas[e.key.toLowerCase()] = false;
});

// ================== MOVER PALETAS ==================
function moverPaletas() {
  const alturaCancha = cancha.clientHeight;
  const alturaP = 90;

  // Jugador 1: W / S
  if (teclas["w"] && p1Y > 0) p1Y -= VELOCIDAD_PALETA;
  if (teclas["s"] && p1Y < alturaCancha - alturaP) p1Y += VELOCIDAD_PALETA;

  // Jugador 2: flechas
  if (teclas["arrowup"] && p2Y > 0) p2Y -= VELOCIDAD_PALETA;
  if (teclas["arrowdown"] && p2Y < alturaCancha - alturaP) p2Y += VELOCIDAD_PALETA;

  paleta1.style.top = p1Y + "px";
  paleta2.style.top = p2Y + "px";
}

// ================== MOVER PELOTA ==================
function moverPelota() {
  const anchoCancha = cancha.clientWidth;
  const alturaCancha = cancha.clientHeight;
  const tamPelota = 16;
  const anchoPaleta = 12;
  const alturaPaleta = 90;

  pelotaX += velX;
  pelotaY += velY;

  // Rebote arriba/abajo
  if (pelotaY <= 0) {
    pelotaY = 0;
    velY = -velY;
  }
  if (pelotaY >= alturaCancha - tamPelota) {
    pelotaY = alturaCancha - tamPelota;
    velY = -velY;
  }

  // Colisión paleta 1 (izquierda)
  const p1X = 20;
  if (
    pelotaX <= p1X + anchoPaleta &&
    pelotaX + tamPelota >= p1X &&
    pelotaY + tamPelota >= p1Y &&
    pelotaY <= p1Y + alturaPaleta
  ) {
    pelotaX = p1X + anchoPaleta;
    velX = Math.abs(velX) + AUMENTO_VELOCIDAD;

    // Ángulo según posición del impacto
    const centro = p1Y + alturaPaleta / 2;
    const rel = (pelotaY + tamPelota / 2 - centro) / (alturaPaleta / 2);
    velY = rel * Math.abs(velX) * 0.8;
  }

  // Colisión paleta 2 (derecha)
  const p2X = anchoCancha - 20 - anchoPaleta;
  if (
    pelotaX + tamPelota >= p2X &&
    pelotaX <= p2X + anchoPaleta &&
    pelotaY + tamPelota >= p2Y &&
    pelotaY <= p2Y + alturaPaleta
  ) {
    pelotaX = p2X - tamPelota;
    velX = -(Math.abs(velX) + AUMENTO_VELOCIDAD);

    const centro = p2Y + alturaPaleta / 2;
    const rel = (pelotaY + tamPelota / 2 - centro) / (alturaPaleta / 2);
    velY = rel * Math.abs(velX) * 0.8;
  }

  // Punto para Jugador 2 (pelota sale por izquierda)
  if (pelotaX < -tamPelota) {
    puntos2++;
    puntos2El.textContent = puntos2;
    if (puntos2 >= PUNTOS_PARA_GANAR) {
      terminarJuego(2);
      return;
    }
    reiniciarPelota();
  }

  // Punto para Jugador 1 (pelota sale por derecha)
  if (pelotaX > anchoCancha) {
    puntos1++;
    puntos1El.textContent = puntos1;
    if (puntos1 >= PUNTOS_PARA_GANAR) {
      terminarJuego(1);
      return;
    }
    reiniciarPelota();
  }

  pelota.style.left = pelotaX + "px";
  pelota.style.top = pelotaY + "px";
}

// ================== LOOP PRINCIPAL ==================
function loop() {
  if (!juegoActivo || pausado) return;

  moverPaletas();
  moverPelota();

  requestAnimationFrame(loop);
}

// ================== TERMINAR JUEGO ==================
function terminarJuego(ganador) {
  juegoActivo = false;
  textoGanador.textContent = `🏆 ¡Jugador ${ganador} gana!`;
  pantallaGanador.classList.remove("oculto");
}

// ================== VOLVER AL MENÚ ==================
function volverAlMenu() {
  juegoActivo = false;
  juego.classList.add("oculto");
  pantallaGanador.classList.add("oculto");
  menu.classList.remove("oculto");
}
