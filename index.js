const { Server } = require('ws')
const express = require('express')

const PORT = process.env.PORT || 3000
const INDEX = '/index.html'

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

const wss = new Server({ server })
let sockets = [];

wss.on('connection', ws => {
  console.log('Client connected')
  // Adicionamos cada nova conexão/socket ao array `sockets`
  sockets.push(ws)
  // Quando você receber uma mensagem, enviamos ela para todos os sockets
  ws.on('message', function(data, isBinary) {
    const message = isBinary ? data : data.toString()
    console.log('Received: %s', message)
    sockets.forEach(s => s.send(message))
  });
  // Quando a conexão de um socket é fechada/disconectada, removemos o socket do array
  ws.on('close', () => {
    console.log('Client disconnected')
    sockets = sockets.filter(s => s !== ws)
  })
})