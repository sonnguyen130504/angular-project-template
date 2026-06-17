import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThreeDAssetCacheService {
  private readonly cacheName = '3d-assets-cache';
  
  // Track download progress for each URL
  readonly downloadProgress = signal<Record<string, number>>({});
  readonly activeDownloads = signal<Record<string, boolean>>({});

  constructor() {}

  /**
   * Resolves a URL to a cached Blob URL or fetches it if not cached.
   * Also updates the download progress signals.
   */
  async getOrCacheAsset(url: string): Promise<string> {
    if (!url) return '';
    if (!('caches' in window)) {
      console.warn('Cache API is not supported in this browser.');
      return url;
    }

    try {
      const cache = await caches.open(this.cacheName);
      const cachedResponse = await cache.match(url);

      if (cachedResponse) {
        // Resolve from cache
        const blob = await cachedResponse.blob();
        return URL.createObjectURL(blob);
      }

      // Fetch and cache with progress tracking
      this.activeDownloads.update((d) => ({ ...d, [url]: true }));
      this.downloadProgress.update((p) => ({ ...p, [url]: 0 }));

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body?.getReader();
      if (!reader) {
        // Fallback if reader not supported
        const clone = response.clone();
        await cache.put(url, clone);
        const blob = await response.blob();
        this.activeDownloads.update((d) => ({ ...d, [url]: false }));
        return URL.createObjectURL(blob);
      }

      let loaded = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          loaded += value.length;
          if (total > 0) {
            const percentage = Math.round((loaded / total) * 100);
            this.downloadProgress.update((p) => ({ ...p, [url]: percentage }));
          }
        }
      }

      // Combine chunks into a single Blob
      const blob = new Blob(chunks as BlobPart[]);
      
      // Store in Cache Storage (create a new response from blob to cache it)
      const cachedHeaders = new Headers(response.headers);
      const cacheResponse = new Response(blob, {
        status: response.status,
        statusText: response.statusText,
        headers: cachedHeaders,
      });
      await cache.put(url, cacheResponse);

      this.activeDownloads.update((d) => ({ ...d, [url]: false }));
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error in ThreeDAssetCacheService:', error);
      this.activeDownloads.update((d) => ({ ...d, [url]: false }));
      return url; // Fallback to original URL
    }
  }

  /**
   * Preloads all models eagerly
   */
  preloadModels(urls: string[]): void {
    urls.forEach((url) => {
      this.getOrCacheAsset(url).catch((err) =>
        console.error(`Failed to preload ${url}`, err)
      );
    });
  }
}
