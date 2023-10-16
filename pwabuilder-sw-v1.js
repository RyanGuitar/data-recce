const CACHE = "pwabuilder-offline";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", async (event) => {
  const cachedFile = await caches.match(event.request);
  const cachedFileVersion = cachedFile
    ? cachedFile.headers.get("version")
    : null; 

  const serverResponse = await fetch(event.request.url);
  const serverFileVersion = serverResponse.headers.get("version"); 

  if (serverFileVersion && serverFileVersion > cachedFileVersion) {
    await caches.open(CACHE);
    await caches.put(event.request, serverResponse);
  }
});

self.addEventListener("activate", async (event) => {
  
  const cachedFiles = await caches.keys(); 

  for (const cachedFile of cachedFiles) {
    const versionedRequest = new Request(event.request.url, {
      headers: {
        version: cachedFile.headers.get("version"),
      },
    });

    const serverResponse = await fetch(versionedRequest);
    const serverFileVersion = serverResponse.headers.get("version"); 

    if (
      serverFileVersion &&
      serverFileVersion > cachedFile.headers.get("version")
    ) {
      await caches.delete(cachedFile);
    }
  }
});

// This is the "Offline copy of pages" service worker

// const CACHE = "pwabuilder-offline";

// importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     self.skipWaiting();
//   }
// });

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);