const express = require('express');
const WebSocket = require('ws');

// Criação do servidor Express (HTTP)
const app = express();
const port = 3000;

// Middleware para aceitar JSON no corpo da requisição
app.use(express.json());

// Criação do servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

let esp32Socket = null; // Variável para armazenar a conexão com a ESP32
let responseQueue = []; // Fila para armazenar respostas e enviar ao aplicativo

// Quando a ESP32 se conectar ao WebSocket
wss.on('connection', function connection(ws) {
    console.log('Cliente (ESP32) conectado');

    // Armazenar a conexão WebSocket da ESP32
    esp32Socket = ws;

    // Quando uma mensagem for recebida da ESP32
    ws.on('message', function incoming(message) {
        message = message.toString();
        console.log('Mensagem recebida da ESP32:', message);

        // Se a ESP32 enviar "stop", enviar a resposta ao aplicativo externo
        if (message === 'stop') {
            const response = responseQueue.shift();
            if (response) {
                console.log('Enviando resposta ao aplicativo externo:', response);
                response();
            }
        }
    });

    // Quando o cliente (ESP32) se desconectar
    ws.on('close', () => {
        console.log('Cliente (ESP32) desconectado');
        esp32Socket = null; // Limpar a variável quando a ESP32 se desconectar
    });
});

console.log('Servidor WebSocket rodando na porta 8080');

// Função para enviar uma mensagem para a ESP32 via WebSocket
function enviarMensagemParaESP32(mensagem) {
    if (esp32Socket) {
        console.log(`Enviando para ESP32: ${mensagem}`);
        esp32Socket.send(mensagem);  // Envia a mensagem para a ESP32
    } else {
        console.log('ESP32 não conectada');
    }
}

// Rota HTTP para receber comandos externos e repassá-los para a ESP32
app.post('/enviar-comando', (req, res) => {
    const comando = req.body;  // Agora a mensagem é apenas o comando, "0" ou "1"
    
    if (comando !== "0" && comando !== "1") {
        return res.status(400).json({ error: 'Comando inválido. Use 0 ou 1.' });
    }

    // Envia o comando para a ESP32
    enviarMensagemParaESP32(comando);

    // Adiciona a resposta à fila para ser retornada assim que a ESP32 enviar "stop"
    responseQueue.push(() => {
        res.json({ status: 'Comando executado pela ESP32', comando: comando });
    });

    res.json({ status: 'Comando enviado para a ESP32, aguardando resposta...' });
});

// Inicia o servidor HTTP
app.listen(port, () => {
    console.log(`Servidor HTTP rodando na porta ${port}`);
});
