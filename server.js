const WebSocket = require('ws');

// Crie um servidor WebSocket na porta 8080
const wss = new WebSocket.Server({ port: 8080 });

// Quando um cliente (como a ESP32) se conecta
wss.on('connection', function connection(ws) {
    console.log('Cliente conectado (ESP32)');

    // Enviar uma mensagem inicial para a ESP32
    ws.send('Olá, ESP32! Conexão estabelecida.');

    // Quando uma mensagem for recebida da ESP32
    ws.on('message', function incoming(message) {
        console.log('Mensagem recebida da ESP32:', message);
        
        // Aqui, o servidor pode enviar de volta uma resposta (se necessário)
        // Exemplo: echo da mensagem
        ws.send('Comando recebido e refletido de volta!');
    });

    // Quando o cliente (ESP32) se desconectar
    ws.on('close', () => {
        console.log('Cliente (ESP32) desconectado');
    });
});

console.log('Servidor WebSocket rodando na porta 8080');
