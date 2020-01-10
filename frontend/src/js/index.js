const canvas = document.getElementById("screen");
const context = canvas.getContext("2d"),
  game = {
    players: {
      player1: { x: 2, y: 2 },
      player2: { x: 4, y: 6 }
    },
    fruits: {
      fruit1: { x: 3, y: 7 }
    }
  };

renderScreen();

function renderScreen() {
  for (const playerId in game.players) {
    const player = game.players[playerId];
    const { x, y } = player;
    context.fillStyle = "#fff";
    context.fillRect(x, y, 1, 1);
  }

  for (const fruitId in game.fruits) {
    const fruit = game.fruits[fruitId];
    const { x, y } = fruit;
    context.fillStyle = "#e8ea34";
    context.fillRect(x, y, 1, 1);
  }

  requestAnimationFrame(renderScreen);
}
