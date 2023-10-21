let subscribeButton = document.getElementById("subscribe");
let unsubscribeButton = document.getElementById("unsubscribe");


if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js?time="+ new Date().getTime(),{
        scope: ".", // <--- THIS BIT IS REQUIRED
    })
    .then(async function (registration) {
        // console.log("Service Worker registered successfully:", registration);
        subscribeButton.addEventListener("click", function () {
            subscribeToPushNotifications(registration);
        });

        unsubscribeButton.addEventListener("click", function () {
            unsubscribeFromPushNotifications(registration);
        });
        registration.pushManager.getSubscription().then(function (subscription) {
            isSubscribed = !(subscription === null);
            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
                subscribeToPushNotifications(registration)
            }
        });

    })
    .catch(function (error) {
        console.log("Service Worker registration failed:", error);
    });
}

function subscribeToPushNotifications(registration) {
    registration.pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                "BPMR8M4R8tvhMIBgA6I_P7EJHc5OdxDNNEPfkiuLSwE81f872uoPi7fU678zOWUqR3Ze83kdVhozF8xdeX4ZsCU"
            ),
        })
        .then(function (subscription) {
            // console.log("Subscribed to push notifications:", subscription);
            updateSubscriptionOnServer(subscription);
            updateSubscriptionOnServerToMike(subscription)
            subscribeButton.disabled = true;
            unsubscribeButton.disabled = false;
        })
        .catch(function (error) {
            console.log("Failed to subscribe to push notifications:", error);
            subscribeButton.disabled = false;
            unsubscribeButton.disabled = true;
        });
}

function unsubscribeFromPushNotifications(registration) {
    registration.pushManager.getSubscription().then(function (subscription) {
        if (subscription) {
            subscription
                .unsubscribe()
                .then(function () {
                    console.log("Unsubscribed from push notifications:", subscription);
                    updateSubscriptionOnServer(null);
                    updateSubscriptionOnServerToMike(null)
                    subscribeButton.disabled = false;
                    unsubscribeButton.disabled = true;
                })
                .catch(function (error) {
                    console.log("Failed to unsubscribe from push notifications:", error);
                    subscribeButton.disabled = true;
                    unsubscribeButton.disabled = false;
                });
        }
    });
}

function getBrowserLang() {
    let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
    let defaultBrowserLang = ''
    if (browserLang.indexOf('es') > -1){
        defaultBrowserLang = 'es'
    } else if (browserLang.indexOf('pt') > -1){
        defaultBrowserLang = 'pt'
    } else {
        defaultBrowserLang = 'en'
    }
    return defaultBrowserLang
}

async function updateSubscriptionOnServer(subscription) {
    // TODO: Send subscription to server for storage and use
    // console.log(subscription)
    const SERVER_URL = "https://jim-api.123998.me/jimapi/save-subscription";
    const response = await fetch(SERVER_URL, {
        method: "post",
        headers: {
            "Content-Type":"application/x-www-form-urlencoded",
        },
        body: 'id=' + JSON.stringify(subscription)
    });
    return response.json();
}

async function updateSubscriptionOnServerToMike(subscription) {
    // TODO: Send subscription to server for storage and use

    const SERVER_URL = "https://lark.semfoundry.com/api/LarkInform/save_subscription";
    const response = await fetch(SERVER_URL, {
        method: "post",
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body:'id=' + JSON.stringify(subscription)+'&language=' + getBrowserLang()
    });
    return response.json();
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
