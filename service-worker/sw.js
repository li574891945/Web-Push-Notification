self.addEventListener("push", function (event) {
  console.log(event.data.text())
  console.log("Received a push message", event);
  console.log(new Date().getTime())

  const data = JSON.stringify(event.data.json())
  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked", event);
  event.notification.close();
  // event.waitUntil(clients.openWindow("https://www.tayloramitverma.com"));
});
