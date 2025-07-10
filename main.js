const imagenes = [
  './assets/imgs/bat.png',
  './assets/imgs/black-cat.png',
  './assets/imgs/clown.png',
  './assets/imgs/crow.png',
  './assets/imgs/devil.png',
  './assets/imgs/ghost.png',
  './assets/imgs/skeleton.png',
  './assets/imgs/skull.png',
  './assets/imgs/tomb.png',
];

let cartas = [];
let primera = null;
let segunda = null;
let bloqueo = false;
let emparejadas = 0;
const intentosMaximos = 20;
let intentosRestantes = intentosMaximos;

const tablero = document.getElementById('tablero');
const intentosSpan = document.getElementById('intentos').querySelector('strong');
const mensajeFinal = document.getElementById('mensajeFinal');
const mensajeTexto = document.getElementById('mensajeTexto');
const btnReiniciar = document.getElementById('reiniciar');
const videoModal = document.getElementById('videoModal');
const videoVictoria = document.getElementById('videoVictoria');

const sonidos = {
  voltear: new Audio('./assets/sonidos/voltear.wav'),
  acierto: new Audio('./assets/sonidos/acierto.wav'),
  error: new Audio('./assets/sonidos/error.wav'),
  perder: new Audio('./assets/sonidos/perder.wav'),
};

const actualizarTexto = (el, valor) => el.textContent = valor;
const ocultar = el => el.classList.add('oculto');
const mostrar = el => el.classList.remove('oculto');
const agregarClase = (el, clase) => el.classList.add(clase);
const quitarClase = (el, clase) => el.classList.remove(clase);

function crearCarta(src) {
  const carta = document.createElement('div');
  carta.classList.add('carta');
  carta.innerHTML = `
    <div class="cara reverso"></div>
    <div class="cara frente"><img src="${src}" alt="carta"></div>
  `;
  return carta;
}

function configurarCarta(carta) {
  tablero.appendChild(carta);
  carta.addEventListener('click', () => manejarClick(carta));
}

function barajarCartas() {
  return [...imagenes, ...imagenes].sort(() => Math.random() - 0.5);
}

function inicializarEstado() {
  [primera, segunda, bloqueo, emparejadas, intentosRestantes] = [null, null, false, 0, intentosMaximos];
  actualizarTexto(intentosSpan, intentosRestantes);
}

function resetearMensajeFinal() {
  ocultar(mensajeFinal);
  quitarClase(mensajeFinal, 'perdida');
}

function mostrarMensaje(texto, gano) {
  actualizarTexto(mensajeTexto, texto);
  mostrar(mensajeFinal);
  if (!gano) agregarClase(mensajeFinal, 'perdida');
  agregarClase(tablero, 'oculto');
  bloqueo = true;
  gano ? mostrarVideoVictoria() : sonidos.perder.play();
}

function mostrarVideoVictoria() {
  mostrar(videoModal);
  videoVictoria.currentTime = 0;
  videoVictoria.play();
}

function reiniciarJuego() {
  inicializarEstado();
  mostrar(tablero);
  resetearMensajeFinal();
  tablero.innerHTML = '';
  cartas = barajarCartas();
  cartas.forEach(src => configurarCarta(crearCarta(src)));
}

function manejarClick(carta) {
  if (bloqueo || carta.classList.contains('volteada')) return;

  sonidos.voltear.play();
  carta.classList.add('volteada');

  if (!primera) {
    primera = carta;
  } else {
    segunda = carta;
    bloqueo = true;
    verificarCartas();
  }
}

function verificarCartas() {
  const img1 = primera.querySelector('img').src;
  const img2 = segunda.querySelector('img').src;

  if (img1 === img2) {
    sonidos.acierto.play();
    emparejadas++;
    animarCartas('exito', 600);

    if (emparejadas === imagenes.length) {
      mostrarMensaje('¡Ganaste!', true);
    }
  } else {
    sonidos.error.play();
    intentosRestantes--;
    actualizarIntentos();
    animarCartas('error', 1000, true);
  }
}

function animarCartas(clase, tiempo, revertir = false) {
  primera.classList.add(clase);
  segunda.classList.add(clase);

  setTimeout(() => {
    primera.classList.remove(clase);
    segunda.classList.remove(clase);
    if (revertir) {
      primera.classList.remove('volteada');
      segunda.classList.remove('volteada');
    }
    reiniciarPareja();
  }, tiempo);
}

function reiniciarPareja() {
  [primera, segunda, bloqueo] = [null, null, false];
}

function actualizarIntentos() {
  actualizarTexto(intentosSpan, intentosRestantes);
  if (intentosRestantes === 0) {
    mostrarMensaje('¡Perdiste!', false);
  }
}

btnReiniciar.addEventListener('click', reiniciarJuego);
videoVictoria.addEventListener('ended', () => ocultar(videoModal));

reiniciarJuego();
