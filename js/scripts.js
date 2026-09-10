/**
 * Referencias al DOM para evitar consultas redundantes.
 */
const DOM = {
    display: document.getElementById('stopwatch-display'),
    btnPlayPause: document.getElementById('btn-play-pause'),
    btnStop: document.getElementById('btn-stop'),
    btnLap: document.getElementById('btn-lap'),
    sphere: document.getElementById('seconds-sphere'),
    lapsContainer: document.getElementById('laps-container'),
    lapsList: document.getElementById('laps-list')
};

/**
 * Estado centralizado de la aplicación.
 */
const state = {
    runningTime: 0,
    startTime: 0,
    animFrameId: null,
    isRunning: false,
    laps: []
};

/**
 * Formatea un valor en ms a estructura M:SS.ms (centésimas).
 * @param {number} timeInMs - Tiempo acumulado en milisegundos.
 * @returns {string} Markup HTML formateado.
 */
const formatTime = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((timeInMs % 1000) / 10);

    const strMins = String(minutes).padStart(2, '0');
    const strSecs = String(seconds).padStart(2, '0');
    const strMs = String(ms).padStart(2, '0');

    return `${strMins}:${strSecs}.<small class="ms-digits">${strMs}</small>`;
};

/**
 * Persiste el estado de la sesión en localStorage para continuidad tras recarga.
 */
const saveState = () => {
    try {
        localStorage.setItem('tempo_state', JSON.stringify({
            runningTime: state.runningTime,
            startTime: state.startTime,
            isRunning: state.isRunning,
            laps: state.laps,
            savedAt: Date.now()
        }));
    } catch (e) {}
};

/**
 * Renderiza el tiempo formateado en el DOM.
 */
const updateDisplay = () => {
    DOM.display.innerHTML = formatTime(state.runningTime);
};

/**
 * Bucle de sincronización alineado a la tasa de refresco del navegador (vía requestAnimationFrame).
 */
const tick = () => {
    if (!state.isRunning) return;
    state.runningTime = Date.now() - state.startTime;
    updateDisplay();
    state.animFrameId = requestAnimationFrame(tick);
};

/**
 * Inicia el cronómetro y activa la animación orbital de la esfera.
 */
const start = () => {
    state.startTime = Date.now() - state.runningTime;
    state.isRunning = true;
    DOM.sphere.style.animation = 'rotacion 60s linear infinite';
    DOM.sphere.style.animationPlayState = 'running';
    DOM.btnPlayPause.classList.add('running');
    tick();
};

/**
 * Pausa la ejecución, congela la animación orbital y guarda la sesión.
 */
const pause = () => {
    state.isRunning = false;
    DOM.sphere.style.animationPlayState = 'paused';
    DOM.btnPlayPause.classList.remove('running');
    if (state.animFrameId) cancelAnimationFrame(state.animFrameId);
    saveState();
};

/**
 * Restablece el cronómetro a cero, limpia el historial de vueltas y purga localStorage.
 */
const stop = () => {
    state.isRunning = false;
    state.runningTime = 0;
    state.laps = [];
    if (state.animFrameId) cancelAnimationFrame(state.animFrameId);
    
    updateDisplay();
    renderLaps();
    
    DOM.sphere.style.animation = 'none';
    DOM.sphere.style.transform = 'rotate(-90deg) translateX(100px)';
    DOM.btnPlayPause.classList.remove('running');
    localStorage.removeItem('tempo_state');
};

/**
 * Conmuta el estado de ejecución entre Start y Pause.
 */
const togglePlayPause = () => {
    state.isRunning ? pause() : start();
};

/**
 * Registra el tiempo actual en el arreglo de vueltas.
 */
const recordLap = () => {
    if (!state.isRunning && state.runningTime === 0) return;
    
    state.laps.unshift(state.runningTime);
    renderLaps();
    saveState();
};

/**
 * Renderiza el listado HTML de las vueltas guardadas.
 */
const renderLaps = () => {
    if (state.laps.length === 0) {
        DOM.lapsContainer.classList.add('hidden');
        DOM.lapsList.innerHTML = '';
        return;
    }

    DOM.lapsContainer.classList.remove('hidden');
    DOM.lapsList.innerHTML = state.laps.map((lapMs, idx) => {
        const lapNum = state.laps.length - idx;
        return `
            <li class="lap-item">
                <span>Lap ${lapNum}</span>
                <span>${formatTime(lapMs)}</span>
            </li>
        `;
    }).join('');
};

/**
 * Restaura la sesión calculando el tiempo transcurrido en segundo plano si la PWA estuvo cerrada.
 */
const restoreSession = () => {
    try {
        const saved = JSON.parse(localStorage.getItem('tempo_state'));
        if (!saved) return;

        state.laps = saved.laps || [];
        renderLaps();

        if (saved.isRunning) {
            const elapsedSinceSave = Date.now() - saved.savedAt;
            state.runningTime = saved.runningTime + elapsedSinceSave;
            start();
        } else {
            state.runningTime = saved.runningTime || 0;
            updateDisplay();
        }
    } catch (e) {}
};

// Eventos de botones
DOM.btnPlayPause.addEventListener('click', togglePlayPause);
DOM.btnStop.addEventListener('click', stop);
DOM.btnLap.addEventListener('click', recordLap);

// Atajos de teclado: Espacio (Play/Pause), L (Lap), R o Esc (Reset)
window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
    } else if (e.code === 'Escape' || e.code === 'KeyR') {
        stop();
    } else if (e.code === 'KeyL') {
        recordLap();
    }
});

// Guardado preventivo al cerrar la ventana
window.addEventListener('beforeunload', () => {
    if (state.isRunning || state.runningTime > 0) {
        saveState();
    }
});

// Inicialización
restoreSession();