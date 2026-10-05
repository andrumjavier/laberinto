// ================== REFERENCIAS ==================
const menu = document.getElementById("menu");
const juego = document.getElementById("juego");
const gameover = document.getElementById("gameover");
const cancha = document.getElementById("cancha");
const jugador = document.getElementById("jugador");
const tiempoEl = document.getElementById("tiempo");
const puntosEl = document.getElementById("puntos");
const recordEl = document.getElementById("record");
const tiempoFinal = document.getElementById("tiempo-final");
const puntosFinal = document.getElementById("puntos-final");
const mensajeRecord = document.getElementById("mensaje-record");

// ================== CONFIGURACIÓN ==================
const VELOCIDAD_JUGADOR = 8;
const INTERVALO_OBSTACULO = 900;      // ms entre obstáculos al inicio
const VELOCIDAD_OBSTACULO = 3;        // px por frame
const AUMENTO_VELOCIDAD = 0.002;      // se acelera cada frame
const REDUCCION_INTERVALO = 30;       // ms menos entre obstáculos al inicio
const INTERVALO_MINIMO = 350;         // no bajar de este intervalo

const EMOJIS_OBSTACULOS = ["🪨", "🌵", "💣", "🔥", "⚡", "🧱"];

// ================== ESTADO ==================
let activo = false;
let pausado = false;
let jugadorX = 325;
let obstaculos = [];
let puntos = 0;
let tiempoSobrevivido = 0;
let velocidadActual = VELOCIDAD_OBSTACULO;
let intervaloActual = INTERVALO_OBSTACULO;
let ultimoSpawn = 0;
let ultimoTiempo = 0;
let animacionId = null;
let intervaloPuntos = null;

const teclas = {};

// ================== RECORD (localStorage) ==================
let record = parseInt(localStorage.getItem("esquivar_record") || "0", 10);
recordEl.textContent = record;

// ================== INICIAR ==================
function iniciarJuego() {
  menu.classList.add("oculto");
  gameover.classList.add("oculto");
  juego.classList.remove("oculto");

  // Reset
  obstaculos.forEach(o => o.el.remove());
  obstaculos = [];
  puntos = 0;
  tiempoSobrevivido = 0;
  velocidadActual = VELOCIDAD_OBSTACULO;
  intervaloActual = INTERVALO_OBSTACULO;
  ultimoSpawn = 0;
  ultimoTiempo = performance.now();
  jugadorX = (cancha.clientWidth - 50) / 2;
  jugador.style.left = jugadorX + "px";

  puntosEl.textContent = "0";
  tiempoEl.textContent = "0";

  activo = true;
  pausado = false;
  animacionId = requestAnimationFrame(loop);

  // Contador de puntos (1 por segundo)
  intervaloPuntos = setInterval(() => {
    if (activo && !pausado) {
      puntos++;
      tiempoSobrevivido++;
      puntosEl.textContent = puntos;
      tiempoEl.textContent = tiempoSobrevivido;
    }
  }, 1000);
}

// ================== TECLADO ==================
document.addEventListener("keydown", (e) => {
  teclas[e.key.toLowerCase()] = true;

  if (e.key === " " && activo) {
    e.preventDefault();
    pausado = !pausado;
    if (!pausado) {
      ultimoTiempo = performance.now();
      loop();
    }
  }

  if (["arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});

document.addEventListener("keyup", (e) => {
  teclas[e.key.toLowerCase()] = false;
});

// ================== MOVER JUGADOR ==================
function moverJugador() {
  const anchoCancha = cancha.clientWidth;
  const anchoJugador = 50;

  if (teclas["arrowleft"] || teclas["a"]) {
    jugadorX -= VELOCIDAD_JUGADOR;
  }
  if (teclas["arrowright"] || teclas["d"]) {
    jugadorX += VELOCIDAD_JUGADOR;
  }

  jugadorX = Math.max(0, Math.min(jugadorX, anchoCancha - anchoJugador));
  jugador.style.left = jugadorX + "px";
}

// ================== CREAR OBSTÁCULO ==================
function crearObstaculo() {
  const el = document.createElement("div");
  el.className = "obstaculo";
  const emoji = EMOJIS_OBSTACULOS[Math.floor(Math.random() * EMOJIS_OBSTACULOS.length)];
  el.textContent = emoji;

  const anchoCancha = cancha.clientWidth;
  const x = Math.random() * (anchoCancha - 40);
  el.style.left = x + "px";
  el.style.top = "-50px";

  cancha.appendChild(el);

  obstaculos.push({
    el: el,
    x: x,
    y: -50,
    ancho: 40,
    alto: 40
  });
}

// ================== ACTUALIZAR OBSTÁCULOS ==================
function actualizarObstaculos() {
  const altoCancha = cancha.clientHeight;

  for (let i = obstaculos.length - 1; i >= 0; i--) {
    const o = obstaculos[i];
    o.y += velocidadActual;
    o.el.style.top = o.y + "px";

    // Fuera de la cancha
    if (o.y > altoCancha + 50) {
      o.el.remove();
      obstaculos.splice(i, 1);
      continue;
    }

    // Colisión con jugador (área reducida para justicia)
    const jX = jugadorX + 8;
    const jY = altoCancha - 70 + 8;
    const jAncho = 34;
    const jAlto = 34;

    if (
      o.x < jX + jAncho &&
      o.x + o.ancho > jX &&
      o.y < jY + jAlto &&
      o.y + o.alto > jY
    ) {
      terminarJuego();
      return;
    }
  }
}

// ================== LOOP ==================
function loop(tiempo) {
  if (!activo || pausado) return;

  if (!tiempo) tiempo = performance.now();
  const delta = tiempo - ultimoTiempo;
  ultimoTiempo = tiempo;

  // Aumentar dificultad con el tiempo
  velocidadActual += AUMENTO_VELOCIDAD;
  intervaloActual = Math.max(INTERVALO_MINIMO, intervaloActual - REDUCCION_INTERVALO * 0.02);

  // Spawn de obstáculos
  ultimoSpawn += delta;
  if (ultimoSpawn >= intervaloActual) {
    crearObstaculo();
    ultimoSpawn = 0;
  }

  moverJugador();
  actualizarObstaculos();

  animacionId = requestAnimationFrame(loop);
}

// ================== TERMINAR ==================
function terminarJuego() {
  activo = false;
  clearInterval(intervaloPuntos);
  cancelAnimationFrame(animacionId);

  tiempoFinal.textContent = tiempoSobrevivido;
  puntosFinal.textContent = puntos;

  if (puntos > record) {
    record = puntos;
    localStorage.setItem("esquivar_record", record);
    recordEl.textContent = record;
    mensajeRecord.textContent = "🎉 ¡Nuevo récord!";
    mensajeRecord.style.color = "#4ade80";
  } else {
    mensajeRecord.textContent = `Récord actual: ${record}`;
    mensajeRecord.style.color = "#94a3b8";
  }

  gameover.classList.remove("oculto");
}

// ================== VOLVER AL MENÚ ==================
function volverAlMenu() {
  activo = false;
  pausado = false;
  clearInterval(intervaloPuntos);
  cancelAnimationFrame(animacionId);

  obstaculos.forEach(o => o.el.remove());
  obstaculos = [];

  juego.classList.add("oculto");
  gameover.classList.add("oculto");
  menu.classList.remove("oculto");
}
