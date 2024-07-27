
# Tic-Tac-Toe Game Play with Computer

## Overview

This repository contains a simple Tic-Tac-Toe game implemented using Node.js and WebSocket. The game allows two players to compete against with one player being a computer opponent. The game is played in the console, where players take turns to make moves.

## Features

- **Twoplayer:** Play against a computer opponent.
- **Real-time Updates:** Moves and game status updates are broadcast to all connected clients in real-time.
- **Simple Console Interface:** Interact with the game through a command-line interface.

## Installation

1. **Clone the Repository:**

   ```
   git clone https://github.com/your-username/tic-tac-toe-game.git
   cd tic-tac-toe-game
   ```

2. **Install Dependencies:**

   Ensure you have Node.js installed. Install the necessary npm packages:

   ```
   npm install
   ```

3. **Run the Server:**

   Start the WebSocket server:

   ```
   node server.js
   ```

4. **Run the Client:**

   Open another terminal window and start the client:

   ```
   node client.js
   ```

   You can run multiple instances of the client to simulate different players.

## How to Play

1. **Start the Game:**
   - Launch the server and the client. The client will prompt you to enter your name.

2. **Join the Game:**
   - When a second client joins, the game will start. One player will play as "X" and the computer as "O".

3. **Make Your Move:**
   - Players take turns entering a move (a number from 0 to 8) to place their mark on the board.

4. **Winning the Game:**
   - The game will announce the winner when there is a three-in-a-row (horizontal, vertical, or diagonal) or a draw.

## Code Explanation

- **`server.js`**: Contains the WebSocket server logic. It handles player connections, game state management, move validation, and broadcasting messages to clients.

- **`client.js`**: Contains the client-side code for interacting with the game. It connects to the WebSocket server, sends moves, and displays game updates.

## Example Usage

**Server Output:**
```
Connected to the server.
Enter your name: John
```

**Client Output:**
```
Enter your name: John
Game started! John (X) vs Computer (O)
 X |   |  
---+---+---
   |   |  
---+---+---
   |   |  
Your turn, John! (You are X)
```

**Client Input:**
```
Enter your move (0-8): 0
```

## Troubleshooting

- **Cannot connect to server:** Ensure that the server is running and listening on the correct port (8080).

- **Invalid move:** Ensure you are entering a number between 0 and 8 for your move.

## Contributing

Feel free to fork the repository, make changes, and submit a pull request. Contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
