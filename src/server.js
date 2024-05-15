const http = require('http')
const app = require('./app')

const Config = {
  port: 3000
}
const server = http.createServer(app.callback())

server.listen(Config.port, () => {
  console.log(`Server start on port ${Config.port}...`)
})

