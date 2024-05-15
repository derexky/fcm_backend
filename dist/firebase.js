"use strict";

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// const { https } = require("firebase-functions");
var _require = require("firebase-functions/v2/https"),
  onRequest = _require.onRequest;
var logger = require("firebase-functions/logger");
var app = require("./app");
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.hello = onRequest(function (request, response) {
  logger.info("Hello logs!", {
    structuredData: true
  });
  response.send("Hello from Firebase!");
});
exports.api = onRequest(app.callback());

// exports.app = https.onRequest(app.callback());