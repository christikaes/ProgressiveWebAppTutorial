# Progressive Web App Tutorial

In this tutorial, we will create a simple Progressive Web App.

You can read more about Progressive Web Apps here: https://developers.google.com/web/progressive-web-apps/
```
Progressive Web Apps are user experiences that have the reach of the web, and are:
* Reliable - Load instantly and never show the downasaur, even in uncertain network conditions.
* Fast - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
* Engaging - Feel like a natural app on the device, with an immersive user experience.
This new level of quality allows Progressive Web Apps to earn a place on the user's home screen.
```

Ready? Let's get started!

## Prereqs
* Chrome
* [Chrome extension Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=en)
* [Http-server](https://www.npmjs.com/package/http-server)

## [Part1] Simple Application
Let's go ahead and create a very simple webpage that has some text, images, and styles.

You can create any static html page or checkout branch `Part1` now

**How Progressive Web App-y is our App?**

We haven't added anything special yet, but let's go ahead and check how our application does straight out of the box.

Run a simple http-server in the directory of your application, and open it up in chrome. Let's run the Lighthouse tool on our page to see how it does!

So far it's doing pretty poorly. The first thing it complains about is that we are missing our service worker.

## [Part2] Registering a Service worker
Let's create and register a service worker!

We will need 2 things:
1. init.js script that will register the service worker when the document is Ready
2. sw.js script that is empty for now. This will be our service worker script

Go ahead and create these files, and add this to `init.js` should have:
```
(function(){
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("./sw.js")
            .then(function() {
                console.log("[Service Worker] Registered");
            });
    }
})()
```
This script will:
1. Check if the serviceWorker is supported by the browser
2. If it is, then register our service worker
3. Once that's done log that our sw is registered

And that's it! We have registered a simple service worker. Checkout `Part2` now.

**How Progressive Web App-y is our App?**

We have now created and registered a service worker, let's see how our application is doing against the Lighthouse tests.

When running lighthouse you will see that the service worker is recognized! However, it still fails to return a 200 when the app is offline.

You can see this by going into the Chrome Dev Tools > Application > Toggle offline. If you refresh the page you still get the offline downasaur ): Let's fix that!

## [Part3] Caching static assets on Install
Right now we have created and registered a service worker, but it isn't caching any static assets or doing anything. That's why we don't see anything different when we go offline.

Let's cache all of our static assets when the service worker is first installed.

First make a list of all of the static assets in the application in `sw.js`. For example, with our application it could be something like:
```
var staticUrls = [
    '/index.html',
    '/styles.css',
    '/image.gif'
]
```

Next, add a listener to when the install event is called and cache all of the static assets:
```
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
```
This script will:
1. Listen to the `install` event on the sw. This gets called once when the sw is first installed
2. Open a new cache called `pwaTutorialCache`
3. Add all of the `staticUrls` to that cache
4. Once that's done end the event

That's all for caching our application static assets! Checkout `Part3` now.

**How Progressive Web App-y is our App?**

If we reload our application in a new browser now (make sure that the sw is reinstalled), you can see that it has created a cache called pwaTutorialCache with all of our static files in it. You can find this under the Chrome Dev Tools > Application > Cache. Awesome!

However if we run our Lighthouse tool again, we will still see the issue that we are not returning a 200 when offline. And if you try to open the application in offline mode, the application will not open.

Why is that? So far we've cached some assets, but we are not serving anything up when we are offline! Let's fix that

## [Part4] Serving Cached files on Fetch
Let's serve those cached files whenever there's a browser fetch. The service worker is a proxy that can intercept any fetch requests that the browser makes. Let's use that to serve cached assets when they are available.

We will need to modify `sw.js` and add an event listener on the fetch event:
```
self.addEventListener('fetch', function(event){
    console.log('[Service Worker] Fetch');
    event.respondWith(
        caches.match(event.request)
            .then(function(response){
                return response || fetch(event.request);
             })
    );
});
```
This script will:
1. Add an event listener on the `fetch` event
2. Check the caches to see if there is anything stored for the given event request
3. If it finds something then it will return the data from the cache
4. If it does not find anything in the cache it will fetch the data from the network

That's it for serving our cached data! Checkout `Part4` now.

**How Progressive Web App-y is our App?**

We have now added the ability to serve content from our cache. Let's check out how our app is doing when we are offline!

Go to the Developer Tools > Application > Toggle offline. Reload the page and...our app loads! That's awesome! Even though we have no internet conectivity, we are able to serve our application from the last time the page was loaded.

Let's run the Lighthouse tool again. This time the 200 response when offline passes. Woo!

## [Part5] Adding a Manifest file
You'll notice that the lighthouse tool is still complaining about not having a manifest.json file. Let's fix that now.

The manifest.json file is similar to a manifest file for native application development. It defines specifics features of the application pertaining to the icon as it appears on the homescreen, the application name, theme color etc.

We can use a generator to create a manifest.json file: https://app-manifest.firebaseapp.com/

Go ahead and generate a manifest.json file for this application and drop it in the root dir. Make sure to add the reference to your `index.html` in the head tag:
```
<link rel="manifest" href="manifest.json">
```

That's all that's needed for the manifest file. Checkout `Part5` now.

**How Progressive Web App-y is our App?**

We now have a manifest.json. We can check to see that the browser sees this by looking at the dev tools. Go to Chrome Dev tools > Application > Manifest. You should see the information from your manifest.json file was extracted correctly.

Go ahead and generate a manifest.json file for this application and drop it in the root dir. Make sure to add the reference to your `index.html` in the head tag:
```
<link rel="manifest" href="manifest.json">
```

That's all that's needed for the manifest file. Checkout `Part5` now.

**How Progressive Web App-y is our App?**

We now have a manifest.json. We can check to see that the browser sees this by looking at the dev tools. Go to Chrome Dev tools > Application > Manifest. You should see the information from your manifest.json file was extracted correctly.

Let's try and run the lighthouse tool again. We should see that it passes most tests at this point! Awesome!

## What's next?
We have built our first simple progressive web application that loads even when the application is offline and is installable to the homescreen. This is just the beginning! Progressive Web Apps are a powerful tool, and if you're interested in learning more checkout these resources:
* https://developers.google.com/web/progressive-web-apps/
* https://codelabs.developers.google.com/codelabs/your-first-pwapp/
* https://codelabs.developers.google.com/codelabs/push-notifications/
* https://jakearchibald.com/2014/offline-cookbook/
