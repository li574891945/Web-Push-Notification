const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush = require("web-push");

// const https = require('https');
// const fs = require('fs');
// let options = {
//   key: fs.readFileSync('./keys/server-key.pem'),
//   ca: [fs.readFileSync('./keys/ca-cert.pem')],
//   cert: fs.readFileSync('./keys/server-cert.pem')
// };

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 4000;

app.get("/api/", (req, res) => res.send("Hello World!"));

const dummyDb = { subscription: null };

const saveToDatabase = async (subscription) => {
  dummyDb.subscription = subscription;
};

// The new /save-subscription endpoint
app.post("/api/save-subscription", async (req, res) => {
  const subscription = req.body;
  if(subscription === '' || subscription === null || typeof subscription === 'undefined' ){
    res.json({ message: "用户未授权" });
  } else {
    console.log("subscription", subscription);

    await saveToDatabase(subscription);
    res.json({ message: "success" });
  }
});

const vapidKeys = {
  publicKey:
      "BPMR8M4R8tvhMIBgA6I_P7EJHc5OdxDNNEPfkiuLSwE81f872uoPi7fU678zOWUqR3Ze83kdVhozF8xdeX4ZsCU",
  privateKey: "RuAZd__egeVcAFmVVhbNsQnKqfMgZffTODV0QyyH8nM",
};

//setting our previously generated VAPID keys
webpush.setVapidDetails(
    "mailto:lijianjunlovelin@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  console.log(subscription, dataToSend)
  webpush.sendNotification(subscription, dataToSend);
};

//route to test send notification
app.get("/api/send-notification", (req, res) => {
  const subscription = dummyDb.subscription; //get subscription from your databse here.
  const resId = req.query.id;
  if(resId > data.length - 1){
    res.json({ message: "id输入0-7" });
  }else{
    const message = JSON.stringify(data[resId]);
    sendNotification(subscription, message);
    res.json({ message: "message sent" });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
// https.createServer(options,app).listen(port,'127.0.0.1');


const data = [
  {
    "body": "n5",
    "icon": "https://betfrom.com/img/logos/Favicon.png",
    "msg-url": "https://betfrom.com/en",
    "title": "n5"
  },
  {
    "body": "hi",
    "icon": "hi",
    "msg-url": "hi",
    "title": "hi"
  },
  {
    "body": "1111",
    "icon": "1111",
    "msg-url": "1111",
    "title": "1111"
  },
  {
    "body": "bodyxxxx",
    "icon": "http://xxxxxxxxxxxxxxxxx",
    "msg-url": "http://xxxxxxxxxxxxxxxxx",
    "title": "title1111"
  },
  {
    "body": "aaa",
    "icon": "aaa",
    "msg-url": "aaa",
    "title": "aaa"
  },
  {
    "body": "content",
    "icon": "yyy",
    "msg-url": "yyyy",
    "title": "content-title"
  },
  {
    "body": "head",
    "icon": "xxxxzzzz",
    "msg-url": "https://omnirect.com/pt-br/dos-sofas-as-nuvens/",
    "title": "head-title"
  },
  {
    "body": "body",
    "icon": "https://betfrom.com/img/logos/Favicon.png",
    "msg-url": "https://omnirect.com/pt-br/melhore-a-sua-experiencia-desportiva/",
    "title": "body-title"
  }
]