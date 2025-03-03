const WebSocket = require('ws');

// Crie um servidor WebSocket na porta 8080
const wss = new WebSocket.Server({ port: 8080 });

// Flag para evitar loop de resposta
let isFirstMessage = true;

wss.on('connection', function connection(ws) {
    console.log('Cliente conectado (ESP32)');

    // Enviar uma mensagem inicial para a ESP32
    ws.send('Olá, ESP32! Conexão estabelecida.');

    // Quando uma mensagem for recebida da ESP32
    ws.on('message', function incoming(message) {
        console.log('Mensagem recebida da ESP32:', message);
        
        // Apenas envie uma resposta se for a primeira vez
        if (isFirstMessage) {
            ws.send('Comando recebido e refletido de volta!');
            isFirstMessage = false; // Marque como já tendo respondido uma vez
        }
    });

    // Quando o cliente (ESP32) se desconectar
    ws.on('close', () => {
        console.log('Cliente (ESP32) desconectado');
    });
});

console.log('Servidor WebSocket rodando na porta 8080');
