"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var Koa = require('koa');
var Router = require('koa-router');
var app = new Koa();
var router = new Router();
// const admin = require('firebase-admin');

var _require = require('./fcm'),
  sendMsg = _require.sendMsg,
  subscribeToTopic = _require.subscribeToTopic;

// 初始化 Firebase Admin SDK
// const serviceAccount = require('../serviceAccountKey-derexky.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// 在此可組合各種 Middleware
// app.use(async function(ctx) {     
//     ctx.body = 'Hello Koa2'; 
// });  

router.get('/', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ctx) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          ctx.body = ['a', 'b', 'c', 'd'].join('-'); //'Hello Koa2 body'; 
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
// Router -> /ready
router.get('/fcm', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ctx) {
    var _ctx$request$header, topic, token, badge, message, pushNotification;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _ctx$request$header = ctx.request.header, topic = _ctx$request$header.topic, token = _ctx$request$header.token, badge = _ctx$request$header.badge; // 定义要推送的消息内容
          message = function message(index) {
            var randomInt = badge ? badge : Math.floor(Math.random() * 100);
            return {
              notification: {
                title: "".concat(Math.random() * 10000000, " \u6D4B\u8BD5\u63A8\u9001\u901A\u77E5").concat(index),
                body: "".concat(Math.random() * 10000000, " \u8FD9\u662F\u4E00\u6761\u6D4B\u8BD5\u63A8\u9001\u901A\u77E5").concat(index)
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
                messageId: "".concat(randomInt),
                chatRoomId: '13144',
                body: "content ".concat(Math.floor(Math.random() * 1000)),
                title: "msg ".concat(randomInt),
                badge: "".concat(randomInt),
                msg: "".concat(Math.random() * 10000000)
              },
              // 可选：定义要发送通知的设备的 token
              // token
              topic: topic || 'topic-test'
            };
          };
          _context2.prev = 2;
          // 发送推送通知
          pushNotification = {
            message: message()
          };
          _context2.next = 6;
          return sendMsg(pushNotification);
        case 6:
          ctx.body = {
            token: token,
            success: true
          };
          _context2.next = 13;
          break;
        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](2);
          ctx.body = {
            token: token,
            success: false
          };
          console.error('发送推送通知时出错:', _context2.t0);
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[2, 9]]);
  }));
  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/subscribe', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(ctx) {
    var _ctx$request$header2, topic, token, response;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _ctx$request$header2 = ctx.request.header, topic = _ctx$request$header2.topic, token = _ctx$request$header2.token;
          _context3.prev = 1;
          _context3.next = 4;
          return subscribeToTopic(token, topic);
        case 4:
          response = _context3.sent;
          //admin.messaging().subscribeToTopic(token, topic)
          console.log("\u6210\u529F\u8A02\u95B1topic: ".concat(topic, ":"), response);
          ctx.body = {
            token: token,
            success: true
          };
          _context3.next = 13;
          break;
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](1);
          ctx.body = {
            token: token,
            success: false
          };
          console.error('訂閱topic时出错:', _context3.t0);
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 9]]);
  }));
  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());
router.get('/ready', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(ctx) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          ctx.body = 'Ready Content';
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());
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
module.exports = app;