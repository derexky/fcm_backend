"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _require = require('google-auth-library'),
  GoogleAuth = _require.GoogleAuth;
var requestPromise = require('request-promise');
var serviceAccount = require('../serviceAccountKey-fcm.json');
var request = requestPromise.defaults({
  time: true,
  timeout: 20 * 1000,
  forever: true,
  resolveWithFullResponse: true
});
var getBearerToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(serviceAccountCredentials) {
    var auth, client, accessToken;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          auth = new GoogleAuth({
            credentials: serviceAccountCredentials,
            scopes: 'https://www.googleapis.com/auth/firebase.messaging'
          });
          _context.next = 4;
          return auth.getClient();
        case 4:
          client = _context.sent;
          _context.next = 7;
          return client.getAccessToken();
        case 7:
          accessToken = _context.sent;
          return _context.abrupt("return", accessToken.token);
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error('Error obtaining Bearer token: ', _context.t0);
          throw _context.t0;
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 11]]);
  }));
  return function getBearerToken(_x) {
    return _ref.apply(this, arguments);
  };
}();
var sendMsg = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message) {
    var accessToken, projectId, uri, requestOptions;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return getBearerToken(serviceAccount);
        case 2:
          accessToken = _context2.sent;
          projectId = serviceAccount.project_id;
          uri = "https://fcm.googleapis.com//v1/projects/".concat(projectId, "/messages:send");
          requestOptions = {
            method: 'POST',
            uri: uri,
            body: message,
            json: true,
            headers: {
              access_token_auth: 'true',
              Authorization: "Bearer ".concat(accessToken)
            }
          };
          _context2.prev = 6;
          _context2.next = 9;
          return request(requestOptions);
        case 9:
          _context2.next = 15;
          break;
        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](6);
          console.error("[fcm] sendToTopic - ".concat(_context2.t0));
          throw _context2.t0;
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[6, 11]]);
  }));
  return function sendMsg(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var subscribeToTopic = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(fcmToken, topic) {
    var accessToken, uri, body, requestOptions, response;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return getBearerToken(serviceAccount);
        case 2:
          accessToken = _context3.sent;
          uri = 'https://iid.googleapis.com/iid/v1:batchAdd';
          body = {
            to: "/topics/".concat(topic),
            registration_tokens: [fcmToken]
          };
          requestOptions = {
            method: 'POST',
            uri: uri,
            body: body,
            json: true,
            headers: {
              access_token_auth: 'true',
              Authorization: "Bearer ".concat(accessToken)
            }
          };
          _context3.prev = 6;
          _context3.next = 9;
          return request(requestOptions);
        case 9:
          response = _context3.sent;
          return _context3.abrupt("return", response.body);
        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](6);
          console.error("[fcm] subscribeToTopic - ".concat(_context3.t0));
          throw _context3.t0;
        case 17:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[6, 13]]);
  }));
  return function subscribeToTopic(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
module.exports = {
  sendMsg: sendMsg,
  subscribeToTopic: subscribeToTopic
};