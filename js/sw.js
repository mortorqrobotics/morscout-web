var CACHE_NAME = 'MorScout-cache-v1';
// all pages (as output by "ls -rm" without directories)
var urlsToCache = 'welcome-page.html, teams.html, sync.html, signup.html, settings.html, reportTeam.html, report.html, profile.html, matches.html, login.html, json.json, index.html, help.html, feedback.html, favicon.ico, createteam.html, createform.html'.split(' ,');

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});
