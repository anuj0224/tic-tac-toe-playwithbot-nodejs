const WebSocket = require('ws');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('Connected to the server.');
});

ws.on('message', (data) => {
    console.log(data.toString());
    if (data.toString().includes('Your turn')) {
        rl.question('Enter your move (0-8): ', (move) => {
            ws.send(move);
        });
    } else if (data.toString().includes('Enter your name')) {
        rl.question('Enter your name: ', (name) => {
            ws.send(name);
        });
    }
});

ws.on('close', () => {
    console.log('Disconnected from the server.');
    rl.close();
});
