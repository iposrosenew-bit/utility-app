/* Service Worker — ค่าสาธารณูปโภค พล.รพศ.1 */
const CACHE = 'utility-rps1-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) {
        return Promise.all(ks.map(function (k) {
          if (k !== CACHE) return caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);

  // ข้อมูลจาก Google ต้องสดใหม่เสมอ — ห้ามแคช
  if (u.hostname.indexOf('google')  > -1) return;
  if (u.hostname.indexOf('gstatic') > -1) return;
  if (u.hostname.indexOf('jsdelivr')> -1) return;
  if (e.request.method !== 'GET') return;
  if (u.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(function (r) {
      return r || fetch(e.request).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
