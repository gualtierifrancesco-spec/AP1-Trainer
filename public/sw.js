// Service Worker: macht die App offline nutzbar.
const CACHE = 'ap1-trainer-v1';
// Große Dateien der KI-Stimme: eigener Speicher, wird nie im Hintergrund neu geladen
const VOICE_CACHE = 'ap1-voice-v1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== VOICE_CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Seite selbst: erst Netz (für Updates), sonst Cache
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html')),
    );
    return;
  }
  // KI-Stimme: zuerst aus dem Speicher, nur beim ersten Mal aus dem Netz
  if (url.origin === location.origin && url.pathname.includes('/tts/') && !url.pathname.endsWith('.js')) {
    e.respondWith(
      caches.open(VOICE_CACHE).then((c) =>
        c.match(req).then((hit) => hit || fetch(req).then((res) => {
          if (res.ok) c.put(req, res.clone()).catch(() => undefined);
          return res;
        })),
      ),
    );
    return;
  }
  // Eigene Dateien und Schriften: aus dem Cache, im Hintergrund aktualisieren
  if (url.origin === location.origin || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req).then((res) => {
          if (res.ok || res.type === 'opaque') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => hit);
        return hit || net;
      }),
    );
  }
});
