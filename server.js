const WebSocket = require('ws');
const axios = require('axios');

// Cria o servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket Server Rodando na porta 8080...');

// Função que envia dados para o ESP32 e aguarda a resposta
async function enviarParaESP32(dados) {
  const esp32Ip = 'http://192.168.15.32'; // Agora com o http://

  try {
    // Envia os dados para o ESP32 via requisição HTTP (pode ser GET ou POST)
    const resposta = await axios.post(esp32Ip, { dados: dados });

    // Retorna a resposta que o ESP32 deu
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
    console.log('Mensagem recebida do cliente:', message);

    // Envia os dados recebidos para o ESP32
    const respostaEsp32 = await enviarParaESP32(message);

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
