/* Hadiya Agency — ilova qobig'ini telefonda saqlab, darhol ochish uchun */
var V = 'ha-v2';
var CORE = ['./', './index.html', './fb.mjs', './manifest.webmanifest', './icons/icon-180.png', './icons/icon-192.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(CORE.map(function (u) { return new Request(u, { cache: 'no-cache' }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var u = new URL(req.url);
  if (u.origin === location.origin) {
    /* Avval saqlangan nusxa darhol beriladi, orqada yangisi yuklab qo'yiladi */
    e.respondWith(caches.open(V).then(function (c) {
      var key = req.mode === 'navigate' ? './index.html' : req;
      return c.match(key, { ignoreSearch: true }).then(function (hit) {
        /* no-cache: brauzer keshini chetlab, server bilan tekshiradi (o'zgarmagan bo'lsa 304 — tez) */
        var net = fetch(req.mode === 'navigate' ? './index.html' : req.url, { cache: 'no-cache' }).then(function (r) { if (r && r.ok) c.put(key, r.clone()); return r; }).catch(function () { return hit; });
        return hit || net;
      });
    }));
    return;
  }
  if (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(V).then(function (c) {
      return c.match(req).then(function (hit) {
        return hit || fetch(req).then(function (r) { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; });
      });
    }));
  }
});
