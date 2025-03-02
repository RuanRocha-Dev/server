const WebSocket = require('ws');
const axios = require('axios');

// Cria o servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket Server Rodando na porta 8080...');

// Função que envia dados para a ESP32 via HTTP e aguarda a resposta
async function enviarParaESP32(dados) {
  const esp32Ip = 'http://192.168.15.32/comando';  // IP estático da ESP32 e a URL da rota /comando

  try {
    // Envia os dados para o ESP32 via requisição HTTP POST
    const resposta = await axios.post(esp32Ip, { dados: dados });
    
    // Retorna a resposta que a ESP32 deu
    return resposta.data;
  } catch (error) {
    console.error('Erro ao se comunicar com o ESP32:', error);
    return { erro: 'Falha na comunicação com o ESP32' };
  }
}

// Função que lida com cada conexão WebSocket
wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');

  // Quando receber uma mensagem do cliente
  ws.on('message', async (message) => {
    console.log('Mensagem recebida do cliente:', message.toString());

    // Envia os dados recebidos para a ESP32
    const respostaEsp32 = await enviarParaESP32(message.toString());

    // Envia a resposta do ESP32 de volta ao cliente WebSocket
    ws.send(JSON.stringify(respostaEsp32));
  });

  // Quando a conexão WebSocket for fechada
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  // Quando houver um erro na conexão WebSocket
  ws.on('error', (error) => {
    console.error('Erro na conexão WebSocket:', error);
  });
});

