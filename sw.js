// Identificador único de la versión del almacenamiento en caché.
const CACHE_NAME = 'tempo-v2-cache';

// Lista de archivos estáticos que se mantendrán disponibles en modo offline.
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/scripts.js',
  '/manifest.json',
  '/assets/icons/favicon.png',
  '/assets/brand/logo.png'
];

/**
 * Instalación: Precarga de activos estáticos en caché y forzado de activación.
 */
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

/**
 * Activación: Purga de cachés obsoletas y control inmediato de clientes.
 */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/**
 * Estrategia de caché: Cache First con fallback de red.
 */
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});