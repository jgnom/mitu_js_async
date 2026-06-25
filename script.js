import { WebSocketServer } from "ws";
import WebSocket from "ws";

const wss = new WebSocketServer({port: 8080});

const symbols = [
    "btcusdt",
    "ethusdt",
    "ltcusdt",
    "bnbusdt",
    "xrpusdt",
    "adausdt",
    "dogeusdt",
    "solusdt",
];

const streams = symbols.map(s =>`${s}@ticker`).join('/')
const binanceUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

const binanceSocket = new WebSocket(binanceUrl);

binanceSocket.onmessage = (event) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(event.data);
        }
    });
};

binanceSocket.onclose = () => {
    console.log("Соединение с биржей закрыто");
};
console.log("WebSocket сервер запущен на порту 8080");

wss.on("connection", () => {
    console.log("новый клиент подключился");

    wss.on("close", () => {
        console.log("клиент отключился");
    });
});
