# Snake Game

This is a simple implementation of the classic Snake game using TypeScript and HTML5 canvas.

## How to play

To play, open [https://snake-pxsm9s.stackblitz.io](https://snake-pxsm9s.stackblitz.io) in your browser. Use the arrow keys to move the snake around and try to eat the food that randomly appears on the screen. As the snake eats food, it grows in length, and the score increases. The game ends if the snake runs into the wall or its own body.

## Code structure

The code consists of several classes:

- `Util`: Contains a static method to generate random integers between a given range.
- `Food`: Represents the food that appears on the screen. It has a position and a method to draw itself on the canvas. When the snake eats the food, the eaten method is called to generate a new random position for the food.
- `Snake`: Represents the snake. It has a position, a body consisting of an array of segments, and a direction. It has methods to move, grow, and draw itself on the canvas.
- `Score`: Represents the score. It has a value that increases as the snake eats food and a method to draw itself on the canvas.
- `InputController`: Handles keyboard input to control the snake's movement.

The `index.html` file imports the `style.css` file and creates a canvas element to render the game. The TypeScript code is compiled to JavaScript and included in the HTML file as a script.

## Game settings

The game has several settings that can be modified:

- `CELL_SIZE`: The size of each cell in the grid.
- `SNAKE_STARTING_LENGTH`: The initial length of the snake.
- `COLOR_BACKGROUND`: The background color of the canvas.
- `COLOR_SCORE`: The color of the score text.
- `FOOD_COLOR`: The color of the food and the snake.
- `MAX_FRAME_RATE`: The maximum number of frames per second.

## Game Overview

This is a classic snake game where the player controls a snake and tries to eat food while avoiding running into walls or the snake's own tail. The game is played on a canvas with a 20x20 grid, and the snake and food are represented by squares of the same size.

### Objective

The objective of the game is to eat as much food as possible without running into walls or the snake's own tail. Each time the snake eats a piece of food, it grows longer and the player's score increases. The game ends when the snake crashes into a wall or its own tail.

### Gameplay

#### Controls

- Arrow keys: move the snake up, down, left, or right

### Game Mechanics

- The game is played on a canvas with a 20x20 grid.
- The snake starts with a length of 5 squares.
- Each time the snake eats a piece of food, it grows longer by one square.
- The snake moves one square at a time.
- The player's score increases by 5 each time the snake eats a piece of food.
- The game ends when the snake crashes into a wall or its own tail.
- The maximum frame rate of the game is set to 5.
- The game has a background color of #96C400, the score is colored #2F5300, and the food is colored #2F5300.

### Game Entities

#### Snake

- The snake is made up of a head and a body.
- The head moves around the canvas and is controlled by the player.
- The body follows the head and grows longer each time the snake eats a piece of food.

#### Food

- The food is represented by a single square on the canvas.
- When the snake eats the food, it disappears and a new piece of food is randomly generated on the canvas.

#### Score

- The score is displayed in the top left corner of the canvas.
- The score increases by 5 each time the snake eats a piece of food.

### Technical Details

- The game is programmed in TypeScript.
- The canvas is selected using the ID "canvas".
- The snake's starting length is set to 5.
- The maximum frame rate of the game is set to 5.
- The game has a background color of #96C400, the score is colored #2F5300, and the food is colored #2F5300.
