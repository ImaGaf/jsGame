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

let cartas = [...imagenes, ...imagenes];
let tablero = document.getElementById('tablero');
const intentosSpan = document.getElementById('intentos').querySelector('strong');
const mensajeFinal = document.getElementById('mensajeFinal');
const mensajeTexto = document.getElementById('mensajeTexto');
const btnReiniciar = document.getElementById('reiniciar');

let primera = null;
let segunda = null;
let bloqueo = false;
let emparejadas = 0;
let intentosMaximos = 20;
let intentosRestantes = intentosMaximos;

const sonidos = {
  voltear: new Audio('./assets/sonidos/voltear.mp3'),
  acierto: new Audio('./assets/sonidos/acierto.mp3'),
  error: new Audio('./assets/sonidos/error.mp3'),
  ganar: new Audio('./assets/sonidos/ganar.mp3'),
  perder: new Audio('./assets/sonidos/perder.mp3'),
};

function crearCarta(src) {
  const carta = document.createElement('div');
  carta.classList.add('carta');
  carta.innerHTML = `
    <div class="cara reverso"></div>
    <div class="cara frente"><img src="${src}" alt="carta"></div>
  `;
  return carta;
}

function actualizarIntentos() {
  intentosSpan.textContent = intentosRestantes;
  if (intentosRestantes === 0) {
    sonidos.perder.play();
    mostrarMensaje('¡Perdiste!', false);
  }
}

function mostrarMensaje(texto, gano) {
  mensajeTexto.textContent = texto;
  mensajeFinal.classList.remove('oculto');
  mensajeFinal.classList.remove('perdida');
  if (!gano) mensajeFinal.classList.add('perdida');
  tablero.classList.add('oculto');
  bloqueo = true;

  if (gano) {
    sonidos.ganar.play();
  } else {
    sonidos.perder.play();
  }
}

function reiniciarJuego() {
  tablero.classList.remove('oculto');
  tablero.innerHTML = '';
  mensajeFinal.classList.add('oculto');
  mensajeFinal.classList.remove('perdida');
  primera = null;
  segunda = null;
  bloqueo = false;
  emparejadas = 0;
  intentosRestantes = intentosMaximos;
  intentosSpan.textContent = intentosRestantes;

  cartas = [...imagenes, ...imagenes].sort(() => 0.5 - Math.random());

  cartas.forEach(src => {
    const carta = crearCarta(src);
    tablero.appendChild(carta);

    carta.addEventListener('click', () => {
      if (bloqueo || carta.classList.contains('volteada')) return;

      sonidos.voltear.play();
      carta.classList.add('volteada');

      if (!primera) {
        primera = carta;
      } else {
        segunda = carta;
        bloqueo = true;

        const img1 = primera.querySelector('img').src;
        const img2 = segunda.querySelector('img').src;

        if (img1 === img2) {
          sonidos.acierto.play();
          primera.classList.add('exito');
          segunda.classList.add('exito');

          setTimeout(() => {
            primera.classList.remove('exito');
            segunda.classList.remove('exito');
          }, 600);

          emparejadas++;
          primera = null;
          segunda = null;
          bloqueo = false;

          if (emparejadas === imagenes.length) {
            mostrarMensaje('¡Ganaste!', true);
          }
        } else {
          sonidos.error.play();
          primera.classList.add('error');
          segunda.classList.add('error');
          intentosRestantes--;
          actualizarIntentos();

          setTimeout(() => {
            primera.classList.remove('error', 'volteada');
            segunda.classList.remove('error', 'volteada');
            primera = null;
            segunda = null;
            bloqueo = false;
          }, 1000);
        }
      }
    });
  });
}



btnReiniciar.addEventListener('click', reiniciarJuego);

reiniciarJuego();


