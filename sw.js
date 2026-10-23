const CACHE = "endesert-v3";
const INTI = [
  "./",
  "index.html",
  "resep.html",
  "kontak.html",
  "offline.html",
  "css/style.css",
  "js/main.js",
  "data.json",
  "manifest.json",
  "images/EnDesert-Logo.jpeg",
  "images/resep/burn_cheese_cake.jpg",
  "images/resep/sandao.jpg",
  "images/resep/CCO.jpeg",
  "images/resep/brownies.jpg",
  "images/resep/Tiramisu.jpg",
  "images/resep/panna-cotta.jpg",
  "images/resep/pudding.jpg",
  "images/resep/mille-crepes.jpg",
  "images/resep/red-velvet.jpg",
  "images/resep/banana-bread.jpg",
  "images/resep/apple-pie.jpg",
  "images/resep/eclair.jpg",
  "images/resep/churos.jpg",
  "images/resep/mochi.jpg",
  "images/resep/eskrim.jpg",
  "images/resep/klepon.jpg",
  "images/resep/Kue_Lapis.jpg",
  "images/resep/dadar-gulung.jpg",
  "images/resep/bolu-kukus.png",
  "images/resep/nastar.jpg",
  "icons/EnDesert-Logo.jpeg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(INTI)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(nama => Promise.all(nama.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request)
      .then(hit => hit || fetch(e.request).then(res => {
        const salin = res.clone();
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, salin));
        return res;
      }))
      .catch(() => e.request.mode === "navigate" ? caches.match("offline.html") : Response.error())
  );
});
