const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let players = [];
let playerNames = [];
let currentPlayerIndex = 0;
let board = Array(9).fill(null);
const symbols = ['X', 'O'];
const computerName = 'Computer';

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.includes(null) ? null : 'Draw';
}

function printBoard() {
    let result = '';
    for (let i = 0; i < 9; i += 3) {
        result += ` ${board[i] || ' '} | ${board[i + 1] || ' '} | ${board[i + 2] || ' '}\n`;
        if (i < 6) result += '---+---+---\n';
    }
    return result;
}

function getEmptyIndices() {
    return board.map((val, index) => val === null ? index : null).filter(val => val !== null);
}

function makeComputerMove() {
    const emptyIndices = getEmptyIndices();

    // Check if the computer can win
    for (const index of emptyIndices) {
        board[index] = symbols[currentPlayerIndex];
        if (checkWinner() === symbols[currentPlayerIndex]) {
            broadcast(printBoard());
            broadcast(`${computerName} (${symbols[currentPlayerIndex]}) wins!`);
            wss.clients.forEach(client => client.close());
            return;
        }
        board[index] = null;
    }

    // Check if the computer can block the player from winning
    const playerSymbol = symbols[(currentPlayerIndex + 1) % 2];
    for (const index of emptyIndices) {
        board[index] = playerSymbol;
        if (checkWinner() === playerSymbol) {
            board[index] = symbols[currentPlayerIndex];
            broadcast(printBoard());
            currentPlayerIndex = (currentPlayerIndex + 1) % 2;
            players[currentPlayerIndex].send(`Your turn, ${playerNames[currentPlayerIndex]}!`);
            return;
        }
        board[index] = null;
    }

    // Make a random move
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    board[randomIndex] = symbols[currentPlayerIndex];

    const winner = checkWinner();
    broadcast(printBoard());

    if (winner) {
        broadcast(winner === 'Draw' ? 'The game is a draw!' : `${computerName} (${symbols[currentPlayerIndex]}) wins!`);
        wss.clients.forEach(client => client.close());
    } else {
        currentPlayerIndex = (currentPlayerIndex + 1) % 2;
        players[currentPlayerIndex].send(`Your turn, ${playerNames[currentPlayerIndex]}!`);
    }
}

wss.on('connection', (ws) => {
    ws.send('Enter your name:');

    ws.on('message', (message) => {
        const playerIndex = players.indexOf(ws);
        if (playerIndex === -1) {
            // New player
            playerNames.push(message.toString());
            players.push(ws);

            if (players.length === 1) {
                playerNames.push(computerName);
                players.push(null); // Placeholder for the computer
                broadcast(`Game started! ${playerNames[0]} (X) vs ${computerName} (O)`);
                broadcast(printBoard());
                players[currentPlayerIndex].send(`Your turn, ${playerNames[currentPlayerIndex]}! (You are X)`);
            }
        } else {
            // Existing player
            if (players[currentPlayerIndex] === ws) {
                const move = parseInt(message.toString(), 10);
                if (!board[move] && move >= 0 && move < 9) {
                    board[move] = symbols[currentPlayerIndex];
                    const winner = checkWinner();

                    if (winner) {
                        broadcast(printBoard());
                        broadcast(winner === 'Draw' ? 'The game is a draw!' : `${playerNames[currentPlayerIndex]} (${symbols[currentPlayerIndex]}) wins!`);
                        wss.clients.forEach(client => client.close());
                    } else {
                        currentPlayerIndex = (currentPlayerIndex + 1) % 2;
                        // broadcast(printBoard());
                        if (playerNames[currentPlayerIndex] === computerName) {
                            setTimeout(makeComputerMove, 1000); // Computer makes a move after a delay
                        } else {
                            players[currentPlayerIndex].send(`Your turn, ${playerNames[currentPlayerIndex]}!`);
                        }
                    }
                } else {
                    ws.send('Invalid move, try again:');
                    ws.send(`Your turn, ${playerNames[currentPlayerIndex]}! (You are ${symbols[currentPlayerIndex]})`);
                }
            } else {
                ws.send('Not your turn!');
            }
        }
    });

    ws.on('close', () => {
        players = players.filter(player => player !== ws);
        playerNames = playerNames.filter((_, index) => players[index] !== ws);
    });
});

function broadcast(message) {
    players.forEach(player => {
        if (player) player.send(message);
    });
}
