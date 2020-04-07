'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "6b848d47eeb04d776f3c88144699f750",
"/": "6b848d47eeb04d776f3c88144699f750",
"main.dart.js": "e2dd07fc929aa1c69213bc3e0e3289a0",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "0cd4c9d954c3e172e7515a3c1053e4e0",
"assets/LICENSE": "f645e083b2de4001d043cf8e0a50f913",
"assets/AssetManifest.json": "166329fab808e3f847e95caa4f5096be",
"assets/FontManifest.json": "01700ba55b08a6141f33e168c4a6c22f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/assets/images/instagram.png": "097b77494452f9352630bcf79697db4d",
"assets/assets/images/banner.jpg": "d916fe509e6f7f9b8afc86c5c728c873",
"assets/assets/images/github.png": "ef7a02b69836dc8b6a732a54c4200dcb",
"assets/assets/images/medium.png": "1832553213f37026ef5595fa39c267d3",
"assets/assets/images/linkedin.png": "af62db1a9ca82aef05e195b7843710be",
"assets/assets/images/profile.jpg": "7e5a0efb5d123fd3c59bcf23229c64c9",
"assets/assets/images/facebook.png": "b5538c29df1c8ca0e55af79295015612",
"assets/assets/json/project_data": "a66f6d38298fb5197cce266d6aa03afe",
"assets/assets/json/blog_data": "b269ba33b7986ce19af4199d276b92e5"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
