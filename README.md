# Snake Game

This is a simple implementation of the classic Snake game using TypeScript and HTML5 canvas.

## How to play

To play, open [https://snake-pxsm9s.stackblitz.io](https://snake-pxsm9s.stackblitz.io) in your browser. Use the arrow keys to move the snake around and try to eat the food that randomly appears on the screen. As the snake eats food, it grows in length, and the score increases. The game ends if the snake runs into the wall or its own body.

## Code structure

The code consists of several classes:

- Util: Contains a static method to generate random integers between a given range.
- Food: Represents the food that appears on the screen. It has a position and a method to draw itself on the canvas. When the snake eats the food, the eaten method is called to generate a new random position for the food.
- Snake: Represents the snake. It has a position, a body consisting of an array of segments, and a direction. It has methods to move, grow, and draw itself on the canvas.
- Score: Represents the score. It has a value that increases as the snake eats food and a method to draw itself on the canvas.
- InputController: Handles keyboard input to control the snake's movement.

The `index.html` file imports the `style.css` file and creates a canvas element to render the game. The TypeScript code is compiled to JavaScript and included in the HTML file as a script.

## Game settings

The game has several settings that can be modified:

- `CELL_SIZE`: The size of each cell in the grid.
- `SNAKE_STARTING_LENGTH`: The initial length of the snake.
- `COLOR_BACKGROUND`: The background color of the canvas.
- `COLOR_SCORE`: The color of the score text.
- `FOOD_COLOR`: The color of the food and the snake.
- `MAX_FRAME_RATE`: The maximum number of frames per second.
