// Agrupamos los elementos del DOM para no buscarlos repetidamente
const DOM = {
    display: document.getElementById('stopwatch-display'),
    btnPlayPause: document.getElementById('btn-play-pause'),
    btnStop: document.getElementById('btn-stop'),
    sphere: document.getElementById('seconds-sphere')
};

// Centralizamos los datos que cambian con el tiempo aquí
const state = {
    runningTime: 0,     // Tiempo acumulado en milisegundos
    intervalId: null,   // Referencia al intervalo para poder detenerlo
    isRunning: false    // Booleano para saber el estado actual
}

// Transforma milisegundos a formato mm:ss (estándar profesional)
const formatTime = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // padStart asegura que siempre haya dos dígitos (ej: 09 en lugar de 9)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Función encargada exclusivamente de actualizar la vista
const updateDisplay = () => {
    DOM.display.textContent = formatTime(state.runningTime);
};

// Acciones principales
const start = () => {
    DOM.sphere.style.animation = 'rotacion 60s linear infinite';
    DOM.sphere.style.animationPlayState = 'running';

    // Calculamos el punto de inicio real restando el tiempo acumulado.
    let startTime = Date.now() - state.runningTime;

    // setInterval ejecuta una función cada 1000ms (1 segundo).
    state.intervalId = setInterval(() => {
        state.runningTime = Date.now() - startTime;
        updateDisplay();
    }, 1000);
};

const pause = () => {
    DOM.sphere.style.animationPlayState = 'paused';
    clearInterval(state.intervalId);    // Detiene el flujo de tiempo del intervalo.
};

const stop = () => {
    // Resetear el estado lógico
    state.isRunning = false;
    state.runningTime = 0;

    clearInterval(state.intervalId);

    updateDisplay();
    DOM.sphere.style.animation = 'none';
    DOM.sphere.style.transform = 'rotate(-90deg) translateX(100px)';
    DOM.btnPlayPause.classList.remove('running');
};

// Función que actúa como interruptor: inicia o pausa según el estado actual
const togglePlayPause = () => {
    // 1. Invertimos el estado (si está corriendo, pausamos; si está pausado, corremos)
    state.isRunning = !state.isRunning;

    // 2. Actualizamos la apariencia visual del botón
    DOM.btnPlayPause.classList.toggle('running', state.isRunning);

    // 3. Ejecutamos la acción correspondiente
    state.isRunning ? start() : pause();
}

DOM.btnPlayPause.addEventListener('click', togglePlayPause);
DOM.btnStop.addEventListener('click', stop);
