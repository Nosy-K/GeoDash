# GeoDash

An endless 2D runner game inspired by Geometry Dash, where a cube must jump over spikes and navigate platforms to survive as long as possible!

## How to Play

1. Open `index.html` in a web browser
2. Press **SPACE** or **Click** to make the cube jump
3. Avoid the red spikes - they're deadly!
4. Use platforms to reach higher areas and avoid obstacles
5. The game gets faster as your score increases
6. Try to beat your high score!

## Features

- **Endless Runner**: The game continues indefinitely with procedurally generated obstacles
- **Jump Mechanics**: Simple one-button control - press space or click to jump
- **Spikes**: Red triangular obstacles that end the game on contact
- **Platforms**: Brown platforms that provide safe areas to land on
- **Score System**: Track your progress with an automatically increasing score
- **Progressive Difficulty**: Game speed increases as you survive longer
- **Smooth Physics**: Gravity and jump mechanics that feel responsive
- **Game Over & Restart**: Instant restart to try again

## Technical Details

- Built with HTML5 Canvas and vanilla JavaScript
- No external dependencies required
- Responsive canvas-based rendering
- Collision detection for player, spikes, and platforms

## Running the Game

Simply open `index.html` in any modern web browser. For local development, you can use a simple HTTP server:

```bash
python3 -m http.server 8080
```

Then navigate to `http://localhost:8080/index.html`

Enjoy the game!