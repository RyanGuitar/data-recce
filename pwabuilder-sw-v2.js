const CACHE = "pwabuilder-offline";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Cache all files using the StaleWhileRevalidate strategy.
workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

// Check for updates to the cached files when the user visits the site.
self.addEventListener("fetch", async (event) => {
  // Get the version of the cached file.
  const cachedFile = await caches.match(event.request);
  const cachedFileVersion = cachedFile ? cachedFile.headers.get("version") : null;

  // Check if there is a newer version of the file available on the server.
  const serverResponse = await fetch(event.request.url);
  const serverFileVersion = serverResponse.headers.get("version");

  // If there is a newer version of the file, update the cache.
  if (serverFileVersion && serverFileVersion > cachedFileVersion) {
    await caches.open(CACHE);
    await caches.put(event.request, serverResponse);
  }
});

// Purge the old cached file.
self.addEventListener("activate", async (event) => {
  // Get all of the cached files.
  const cachedFiles = await caches.keys();

  // For each cached file, check if there is a newer version of the file available on the server.
  for (const cachedFile of cachedFiles) {
    const versionedRequest = new Request(event.request.url, {
      headers: {
        version: cachedFile.headers.get("version")
      }
    });

    const serverResponse = await fetch(versionedRequest);
    const serverFileVersion = serverResponse.headers.get("version");

    // If there is a newer version of the file, purge the old cached file.
    if (serverFileVersion && serverFileVersion > cachedFile.headers.get("version")) {
      await caches.delete(cachedFile);
    }
  }
});
