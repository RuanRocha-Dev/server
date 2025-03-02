const WebSocket = require('ws');
const express = require('express');
const app = express();

// Cria o servidor WebSocket para o React Native se conectar
const wss = new WebSocket.Server({ port: 8080 });

console.log('Servidor WebSocket para o React Native na porta 8080');

// URL do WebSocket do ESP32
const esp32WebSocket = new WebSocket('ws://192.168.15.32:5088'); // Substitua com o IP do seu ESP32

// Conectar ao WebSocket do ESP32
esp32WebSocket.on('open', () => {
  console.log('Conectado ao WebSocket do ESP32');
});

// Quando um cliente React Native se conectar ao servidor Node.js
wss.on('connection', (ws) => {
  console.log('Cliente React Native conectado');

  // Quando o cliente envia uma mensagem (comando para o ESP32)
  ws.on('message', (message) => {
    console.log(`Mensagem do cliente: ${message}`);
    
    // Envia o comando para o ESP32 (ex: "1" para ligar, "0" para desligar)
    if (esp32WebSocket.readyState === WebSocket.OPEN) {
      esp32WebSocket.send(message);
    } else {
      console.log('Erro: Não foi possível enviar mensagem ao ESP32');
    }
  });

  // Recebe a resposta do ESP32 e envia de volta para o cliente
  esp32WebSocket.on('message', (response) => {
    console.log(`Resposta do ESP32: ${response}`);
    
    // Envia a resposta de volta para o cliente React Native
    ws.send(response);
  });

  // Quando o cliente desconectar
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

app.listen(3000, () => {
  console.log('Servidor Node.js rodando na porta 3000');
});
