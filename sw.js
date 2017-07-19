var staticUrls = [
    './',
    './index.html',
    './styles.css',
    './image.gif'
]

self.addEventListener('install', function(event){
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open('pwaTutorialCache')
            .then(function(cache){
                console.log('[Service Worker] Caching Static Files');
                return cache.addAll(staticUrls);
            })
    );
});