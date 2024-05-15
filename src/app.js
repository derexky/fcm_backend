const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
// const admin = require('firebase-admin');

const { sendMsg, subscribeToTopic } = require('./fcm')

// 初始化 Firebase Admin SDK
// const serviceAccount = require('../serviceAccountKey-derexky.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


// 在此可組合各種 Middleware
// app.use(async function(ctx) {     
//     ctx.body = 'Hello Koa2'; 
// });  

router.get('/', async ctx => {
  ctx.body = ['a', 'b', 'c', 'd'].join('-'); //'Hello Koa2 body'; 
});
// Router -> /ready
router.get('/fcm', async ctx => {
  const { topic, token, badge } = ctx.request.header
  // 定义要推送的消息内容
  const message = index => {
    const randomInt = badge ? badge : Math.floor(Math.random() * 100)
    return {
      notification: {
        title: `${Math.random() * 10000000} 测试推送通知${index}`,
        body: `${Math.random() * 10000000} 这是一条测试推送通知${index}`
      },
      // apns: {
      //   payload: {
      //     aps: {
      //       badge: randomInt
      //     }
      //   }
      // },
      data: {
        type: 'CBS-push-notification',
        messageId: `${randomInt}`,
        chatRoomId: '13144',
        body: `content ${Math.floor(Math.random()*1000)}`,
        title: `msg ${randomInt}`,
        badge: `${randomInt}`,
        msg: `${Math.random() * 10000000}`
      },
      // 可选：定义要发送通知的设备的 token
      // token
      topic: topic || 'topic-test'
    };
  };
  try {
    // 发送推送通知
    const pushNotification = {
      message: message(),
    }
    await sendMsg(pushNotification)
    ctx.body = {
      token,
      success: true
    };
  } catch (error) {
    ctx.body = {
      token,
      success: false
    };
    console.error('发送推送通知时出错:', error);
  }
});

router.get('/subscribe', async(ctx) => {
  const { topic, token } = ctx.request.header
  try {
    const response = await subscribeToTopic(token, topic)//admin.messaging().subscribeToTopic(token, topic)
    console.log(`成功訂閱topic: ${topic}:`, response); 
    ctx.body = { token, success: true };
  } catch (error) {
    ctx.body = { token, success: false };
    console.error('訂閱topic时出错:', error);
  }
})

router.get('/ready', async ctx => {
  ctx.body = 'Ready Content';
});
// app.use(async (ctx, next) => {
//     await next();
//     console.log(`aaa`);
// });
// app.use(async (ctx, next) => {

//     console.log(`bbb`);
//     await next();
// });
// app.use(async (ctx, next) => {
//     await next();
//     console.log(`ccc`);
// });
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app