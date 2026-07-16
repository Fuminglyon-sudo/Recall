// Call on sign-out so a shared device doesn't keep serving cached
// authenticated pages from the offline cache after the session ends.
// The service worker's "message" listener deletes its cache on receipt.
export function purgeOfflineCaches() {
  navigator.serviceWorker?.controller?.postMessage("purge-caches");
}
