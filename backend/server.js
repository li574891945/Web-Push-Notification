const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush = require("web-push");
const fs = require("fs");
const schedule = require('node-schedule');

// const https = require('https');
// const fs = require('fs');
// let options = {
//   key: fs.readFileSync('./keys/server-key.pem'),
//   ca: [fs.readFileSync('./keys/ca-cert.pem')],
//   cert: fs.readFileSync('./keys/server-cert.pem')
// };

const app = express();
// app.use(cors());
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());

// 处理application/x-www-form-urlencoded内容格式的请求体
// app.use(bodyParser.urlencoded({extended: false}));
// app.use((req,res,next)=>{
//     //针对跨域进行配置，允许任何源访问
//     // res.header('Access-Control-Allow-Origin', "*")
//     // 允许前端请求中包含Content-Type这个请求头
//     res.header('Access-Control-Allow-Headers', 'Content-Type')
//     next()
// })

const port = 4000;

app.get("/jimapi/", (req, res) => res.send("Hello World!"));

app.post("/jimapi/getdefhref",  (req, res) => {
    res.json({ url: "https://tracker.apostarde.com/link?btag=50921004_290207" });
});

const dummyDb = { subscription: null };

const saveToDatabase = async (subscription) => {
    dummyDb.subscription = subscription;
};

fs.writeFile('./db.json', JSON.stringify([]), function (err) {

});

const vapidKeys = {
    publicKey:"BPMR8M4R8tvhMIBgA6I_P7EJHc5OdxDNNEPfkiuLSwE81f872uoPi7fU678zOWUqR3Ze83kdVhozF8xdeX4ZsCU",
    privateKey: "RuAZd__egeVcAFmVVhbNsQnKqfMgZffTODV0QyyH8nM",
};

app.get("/jimapi/getPublicKey", (req, res) => res.send({publicKey:vapidKeys.publicKey}));

// The new /save-subscription endpoint
app.post("/jimapi/save-subscription", async (req, res) => {
    const subscription = JSON.parse(req.body.id);
    console.log("subscription", subscription);
    if(subscription === '' || subscription === null || typeof subscription === 'undefined' ){
        res.json({ message: "用户未授权" });
    } else {
        fs.readFile('./db.json', function (err, data) {
            let json = JSON.parse(data);
            let existedSub = json.find((el) => el?.endpoint === subscription.endpoint);
            if (existedSub) {
                res.json({ message: "已经注册了" });
            } else {
                json.push(subscription);

                fs.writeFile('./db.json', JSON.stringify(json), function (err) {
                    if (err) {
                        res.json({ message: "添加用户失败" });
                    };
                });
                res.json({ message: "添加用户成功" });
            }
        });
        // await saveToDatabase(subscription);
        // res.json({ message: "success" });
    }
});

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
app.get("/jimapi/send-notification", (req, res) => {
    const subscription = dummyDb.subscription; //get subscription from your databse here.
    const resId = req.query.id;
    console.log(resId)
    if(resId > data.length - 1){
        res.json({ message: "id输入0-7" });
    }else{
        // const message = JSON.stringify(data[resId]);
        // sendNotification(subscription, message);
        // res.json({ message: "message sent" });
        const message = JSON.stringify(data[resId]);
        fs.readFile('./db.json', function (err, data) {
            let json = JSON.parse(data);

            json.map((item) => {
                // try {
                //   sendNotification(item, message);
                // } catch (error){
                //   errArr.push(item)
                // }
                webpush.sendNotification(item, message).then(res => {
                    console.log('发送成功')
                }).catch(err => {
                    console.log('当前错误')
                    let existedSub = json.find((el) => el?.endpoint === item.endpoint);
                    json.splice(existedSub,1)
                    fs.writeFile('./db.json', JSON.stringify(json), function (err) {

                    });
                });
            });
            res.json({ message: "message sent" });
        });
    }
});


// 定义规则
let rule = new schedule.RecurrenceRule();
rule.second = [0, 10, 20, 30, 40, 50]; // 每隔 10 秒执行一次
 
// 启动任务
let job = schedule.scheduleJob(rule, () => {
 console.log(new Date());
//  const resId = Math.round(Math.random()*(data.length-1)); 
    // console.log(resId)
    const message = JSON.stringify(data[0]);
    fs.readFile('./db.json', function (err, data) {
        let json = JSON.parse(data);

        json.map((item) => {
            webpush.sendNotification(item, message).then(res => {
                console.log('发送成功')
            }).catch(err => {
                console.log('当前错误')
                let existedSub = json.find((el) => el?.endpoint === item.endpoint);
                json.splice(existedSub,1)
                fs.writeFile('./db.json', JSON.stringify(json), function (err) {
                });
            });
        });
    });
   
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
// https.createServer(options,app).listen(port,'127.0.0.1');

const data = [
    {
        "body": "This is a year's effort.79 Ibs lost\nbetween these pictures",
        "icon": "https://betfrom.com/img/logos/Favicon.png",
        "msgUrl": "https://betfrom.com/en",
        "image": "https://betfrom.com/img/promotions/993_9df827aeb3474bb6a003a7e1ff937f5f.webp",
        "title": "CICO",
        "badge": "https://betfrom.com/img/logos/Favicon.png",
        "actions": [
            {
                "action": "archiveOne",
                "title": "details",
                "msgUrl": "https://betfrom.com/en"
            },
            {
                "action": "archiveTwo",
                "title": "cancel",
                "msgUrl": "https://betfrom.com/en"
            }
        ]
    }
]