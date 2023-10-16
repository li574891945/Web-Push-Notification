let json = {
  'msg-url':''
}

self.addEventListener("push", function (event) {
  console.log("Received a push message", event);
  console.log(new Date().getTime())
  console.log(event.data.json())
  console.log(event.data.text())

  const data = event.data.json()
  const json = event.data.json()

  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked", event);
  console.log(event.data)

  event.notification.close(json);
  event.waitUntil(clients.openWindow(json["msg-url"]));
});
