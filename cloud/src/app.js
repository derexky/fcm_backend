const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const admin = require('firebase-admin');

// 初始化 Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey-derexky.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
/** 
在此可組合各種 Middleware
**/
// app.use(async function(ctx) {     
//     ctx.body = 'Hello Koa2'; 
// });  

router.get('/', async ctx => {
  ctx.body = ['a', 'c', 'c'].join('-'); //'Hello Koa2 body'; 
});
// Router -> /ready
router.get('/fcm', async ctx => {
  const {
    token,
    badge
  } = ctx.request.query;
  // 定义要推送的消息内容
  const message = index => {
    return {
      notification: {
        title: `${Math.random() * 10000000} 测试推送通知${index}`,
        body: `${Math.random() * 10000000} 这是一条测试推送通知${index}`
      },
      apns: {
        payload: {
          aps: {
            badge: 12
          }
        }
      },
      data: {
        badge: `${Math.floor(Math.random() * 100)}`,
        msg: `${Math.random() * 10000000}`
      },
      // 可选：定义要发送通知的设备的 token
      token
      // topic: 'topic-test'
    };
  };
  try {
    // await admin.messaging().subscribeToTopic([token], 'topic-test')
    // 发送推送通知
    for (let i = 0; i < 1; i++) {
      const response = await admin.messaging().send(message(i));
      console.log(`成功发送推送通知${i}:`, response);
    }
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
router.get('/ready', async ctx => {
  ctx.body = 'Ready1111 Content';
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