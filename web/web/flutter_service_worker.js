'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "b74e4a093f345bb798858982f0740b16",
"assets/AssetManifest.bin.json": "5f8909ec30774accc788e1abb46895d6",
"assets/assets/bag.png": "4bcfcb9c441ced33f516680b30468662",
"assets/assets/dashboard/man.png": "0b16965dda868b4de52628b34a583648",
"assets/assets/dashboard/transgender.png": "793c7d316227e4c3139b855a2ce58c54",
"assets/assets/dashboard/woman.png": "569e572826e057b5056dbad2f0bef46a",
"assets/assets/DejaVuSans.ttf": "be189a7e2711cdf2a7f6275c60cbc7e2",
"assets/assets/emojis/32.png": "6be4b3ee23da424662e9248266d09d74",
"assets/assets/emojis/33.png": "965a533a110646e4ebaba6a22f734d66",
"assets/assets/emojis/34.png": "cb458d7e9b696f73a640444e7bc2cffc",
"assets/assets/emojis/35.png": "5f14d8c593a2f4b9699325d43d921063",
"assets/assets/emojis/36.png": "f39e7ecb9b07f363ba141ce6eb319d38",
"assets/assets/emojis/37.png": "43b6dbd0a4e0e9f72da709c2b656dbea",
"assets/assets/emojis/body_1.png": "93cf858572594d0e842c735af4fb0023",
"assets/assets/emojis/mild.png": "d415fef466c84080cf6e715096e73d23",
"assets/assets/emojis/moderate.png": "cb9d8ed7b270b4f8c3197133c88f9a2c",
"assets/assets/emojis/no%2520pain.png": "fe44a3d6f368a664fc2ec84b3dd795cf",
"assets/assets/emojis/severe.png": "8c910c6a2218711c78e9c95dcaaf4d1e",
"assets/assets/emojis/very_severe.png": "0a50f0441d81aa4d99f2e948ed37649a",
"assets/assets/emojis/worst_pain_passible.png": "e46956f154a18a266dd27826b2d3b89c",
"assets/assets/head_1.png": "f5c2dcb7445d0fc9fc3018151c698a32",
"assets/assets/head_2.png": "573d3692443019a192eb3570f51cc3b1",
"assets/assets/icons/download_icon.png": "bc7b78ab3d557f795262eb0552b2e617",
"assets/assets/icons/green.jpeg": "dea6d92d765b8a55039d41b44af4f4f5",
"assets/assets/icons/Group%25201272629001.svg": "8cdcd32818807eb0d011c41453ec1aa8",
"assets/assets/icons/logout.png": "70f072ead4595ddf8661885ecf7a13c6",
"assets/assets/icons/red.jpeg": "8e81ca135d2891ab3c1fda3a9b2593b7",
"assets/assets/images/admin.png": "cc4309be5637ad04c8e70c77cf6dfd9d",
"assets/assets/images/Burns.png": "e0544a84523426a72e296edde84bf7e4",
"assets/assets/images/Emo.png": "384905af891c044c3c6264c112677ea6",
"assets/assets/images/Emo_Doctor.png": "c292c010f8c8d38b0aad3923eef60698",
"assets/assets/images/Outline.png": "2ce77e3d49dd6d2b1f9b366d6f77a658",
"assets/assets/images/outline_admin.png": "0b927179212d9343d7196bed8fcdf58c",
"assets/assets/images/outline_new.png": "97d9ffd2713540119a8660a9f2584b7d",
"assets/assets/images/Poison.png": "229e8a8b074f54227324c32f399c612a",
"assets/assets/images/Prem.png": "f58045b8533dd93ef6e9c8bed8c9d111",
"assets/assets/images/Stemi.png": "3a0d128c64b683a1aea1a234e3d556b8",
"assets/assets/images/Strock.png": "a90935c0142961fb1fbc73bd79dfc957",
"assets/assets/images/Trauma.png": "c04e85bcf2df0e11044abf963d495e00",
"assets/assets/images/Triage.png": "60aa949e26cbb7c8065c111b883477de",
"assets/assets/img.png": "df9f6b135e7ef39a67c0a4db58f0f9d1",
"assets/assets/logo/green_1.png": "7a8503f33f3d01b3577416abf0e14fec",
"assets/assets/logo/nhm_logo.png": "cb6e3f6d01add4a247f04b6f787433df",
"assets/assets/logo/pillars_logo.svg": "6dfb56b09a5ca5b5a08d0ef371437b8b",
"assets/assets/logo/Red.png": "33e0b00cc8494e600a0465c53ee7f6dc",
"assets/assets/logo/taei_logo.jpeg": "69be61b5a972d6c244933ac8cfeb44d0",
"assets/assets/logo/test2.jpeg": "c0c31ded3838571aa6bfa5403f9bf8d4",
"assets/assets/logo/test_1.png": "faa0e95f35821ae27c0e7470b89e8158",
"assets/assets/logo/tnhsrp_logo.jpeg": "10775e2c978aeb61ea564dc140791694",
"assets/assets/logo/tnshp_logo.jpg": "a46b89c02ecc69f78ef2d3801014bdfa",
"assets/assets/logo/tn_logo.png": "a0e35c5ce2587370b9113191e3b07a75",
"assets/assets/low/Burns.png": "f8266d98ff9c8a4fd8b0363ee33c1294",
"assets/assets/low/Emo.png": "685ab52adb526d460c9b013bbfd84f34",
"assets/assets/low/Outline.png": "cebc1df024bcd67effb1def058136ecb",
"assets/assets/low/Poison.png": "9172301b4700d70cee21a92af8396529",
"assets/assets/low/Prem.png": "4eae53d36c8d470cdf602eab7d5c880e",
"assets/assets/low/Stemi.png": "e90448daeeb7af8eed2716b7a3617add",
"assets/assets/low/Strock.png": "20fa830078b7fe45306c2be4951de4d3",
"assets/assets/low/Trauma.png": "eb3efb18573b4bb1dd42c4467e4ac981",
"assets/assets/low/Triage.png": "593edb33465796ae49acd2f00ff5115f",
"assets/assets/NotoSans-Regular.ttf": "28ffc9e17c88630d93bf3fe92a687d04",
"assets/assets/paper.png": "c5d21e4bfa0c4868c660b2e5ba766528",
"assets/assets/pillar/burns_logo.jpg": "8b209a1bc8b95d90de81a3a74461798b",
"assets/assets/pillar/pillars.png": "f9fa6e841c1395e69fbe3e3ff6b7f1f0",
"assets/assets/pillar/poison_logo.jpg": "a5b3e3c92c36e2f5bce9006e479947f7",
"assets/assets/pillar/prem_logo.jpg": "bb88541d59ff2519ebece7a3c1244926",
"assets/assets/pillar/script_logo.jpg": "ad7a2a672134e6011b45da806c4e37c9",
"assets/assets/pillar/stemi_logo.jpg": "f0e663e0f2a9cd6a5e164ccdc82226d0",
"assets/assets/pillar/trauma_logo.jpg": "94f32b4c086da6473cd644250717db6d",
"assets/assets/pillars/burn.png": "87c92454186438788022619f23a469ec",
"assets/assets/pillars/img.png": "c5167aba9f09ed37faac95ef368136ae",
"assets/assets/pillars/img_1.png": "c5167aba9f09ed37faac95ef368136ae",
"assets/assets/pillars/img_10.png": "a57e691559e9e44b6d46936ad0350989",
"assets/assets/pillars/img_2.png": "87bec809550d329273d5be0de9e04a13",
"assets/assets/pillars/img_3.png": "45bfe103cec0e09b27d2af715afffcae",
"assets/assets/pillars/img_4.png": "8486010f8a4abe602df9d8046448a03b",
"assets/assets/pillars/img_5.png": "80327d00403d8f4e0a97d2cf4a839c51",
"assets/assets/pillars/img_6.png": "7c0f193a306b759efe8c5bda0267d6e0",
"assets/assets/pillars/img_7.png": "2defb8fa1257aecbef93b3d8de637a54",
"assets/assets/pillars/img_8.png": "60c230cc67f310eb8f4c644ce9288b4d",
"assets/assets/pillars/img_9.png": "513da510999cfc99f6db2b8ebd551cd8",
"assets/assets/pillars/pillar1.png": "513da510999cfc99f6db2b8ebd551cd8",
"assets/assets/pillars/pillar2.png": "7005c6522621a36488b1ff36a2318c2c",
"assets/assets/pillars/pillar3.png": "18cd7aacdd95c434dc9dcf501735db18",
"assets/assets/pillars/pillar4.png": "b51e140b03182960aab093472b2764e9",
"assets/assets/pillars/pillar5.png": "b51e140b03182960aab093472b2764e9",
"assets/assets/pillars/pillar6.png": "be6b27db3742a138d17729e51e7e001f",
"assets/assets/pillars/pillars.png": "f9fa6e841c1395e69fbe3e3ff6b7f1f0",
"assets/assets/pillars/Pillars_logo.png": "14ee6d483b8dede13543be0a182e5f7b",
"assets/assets/pillars/poison.png": "0e4165209b29309e4a816be348dfd6b4",
"assets/assets/pillars/prem.png": "5a94818901af3073222a407dde8a1008",
"assets/assets/pillars/script.png": "894a1aa72292e8034257d550ad009c9f",
"assets/assets/pillars/stemi.png": "5438b077d1791be928faeab7679f2c40",
"assets/assets/pillars/test.svg": "9f204a0a49f2118826507de76b71d759",
"assets/assets/pillars/top.png": "cfa963202d2d3eeaf74ce57f8657a485",
"assets/assets/pillars/trauma.png": "be7a296ba95c7469cb0e1b42f60df027",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "575a3d70b466f7c5ac293b0a38f94ad1",
"assets/NOTICES": "6cf6a1ba6de89d1d3b4a54da028b9d05",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01",
"favicon.png": "f66ad2edb53eed9b8e80e12bf0e13d3e",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"flutter_bootstrap.js": "ef19748267746568bf1029b8a8744a2a",
"icon-192.png": "db53a51e7bcdbd438b3b7c5964879523",
"icon-512.png": "3045a070a0f872dffb513790894fd97f",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "9fac582f5b6f13d44d354b1f099786f0",
"/": "9fac582f5b6f13d44d354b1f099786f0",
"main.dart.js": "7d968a37846e3fe0cb765d21774de697",
"manifest.json": "9e0438771c631ad97f35752a63d521bd",
"taei_logo.png": "b6431d4098a6cd8b32f8728cd3eb6ca7",
"version.json": "c3525edf479ae6a2983a13626aead1e6"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
