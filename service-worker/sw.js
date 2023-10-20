let json = {
  'msg-url':''
}

self.addEventListener("push",  (event) => {
  // console.log("Received a push message", event);
  // console.log(new Date().getTime())
  // console.log(event.data.json())
  // console.log(event.data.text())

  const data = event.data.json()
  json = event.data.json()

  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon,
    image: data.image
  };
  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener("notificationclick",  (event) => {
  // console.log("Notification clicked", event);
  // console.log(event)
  // console.log(json)

  event.notification.close();
  event.waitUntil(clients.openWindow(json["msg-url"]));
});
