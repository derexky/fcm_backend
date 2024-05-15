const { GoogleAuth } = require('google-auth-library')
const requestPromise = require('request-promise')

const serviceAccount = require('../serviceAccountKey-fcm.json');

const request = requestPromise.defaults({
  time: true,
  timeout: 20 * 1000,
  forever: true,
  resolveWithFullResponse: true,
})

const getBearerToken = async (serviceAccountCredentials) => {
  try {
    const auth = new GoogleAuth({
      credentials: serviceAccountCredentials,
      scopes: 'https://www.googleapis.com/auth/firebase.messaging',
    })
    const client = await auth.getClient()

    const accessToken = await client.getAccessToken()
    return accessToken.token
  } catch (error) {
    console.error('Error obtaining Bearer token: ', error);
    throw error;
  }
}

const sendMsg = async (message) => {
  const accessToken = await getBearerToken(serviceAccount)
  const projectId = serviceAccount.project_id
  const uri = `https://fcm.googleapis.com//v1/projects/${projectId}/messages:send`
  const requestOptions = {
    method: 'POST',
    uri,
    body: message,
    json: true,
    headers: {
      access_token_auth: 'true',
      Authorization: `Bearer ${accessToken}`,
    },
  }
  try {
    await request(requestOptions)
  } catch (error) {
    console.error(`[fcm] sendToTopic - ${error}`)
    throw error
  }
}

const subscribeToTopic = async (fcmToken, topic) => {
  const accessToken = await getBearerToken(serviceAccount)
  const uri = 'https://iid.googleapis.com/iid/v1:batchAdd'
  const body = {
    to: `/topics/${topic}`,
    registration_tokens: [fcmToken],
  }
  const requestOptions = {
    method: 'POST',
    uri,
    body,
    json: true,
    headers: {
      access_token_auth: 'true',
      Authorization: `Bearer ${accessToken}`,
    },
  }
  try {
    const response = await request(requestOptions)
    return response.body
  } catch (error) {
    console.error(`[fcm] subscribeToTopic - ${error}`)
    throw error
  }
}

module.exports = { sendMsg, subscribeToTopic}