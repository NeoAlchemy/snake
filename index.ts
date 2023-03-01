// Import stylesheets
import './style.css';

var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = '4px solid #2F5300';
canvas.focus();

const CELL_SIZE = 20;
const SNAKE_STARTING_LENGTH = 5;
const COLOR_BACKGROUND = '#96C400';
const COLOR_SCORE = '#2F5300';
const FOOD_COLOR = '#2F5300';
const MAX_FRAME_RATE = 5;

class Util {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

class Food {
  public x: number;
  public y: number;
  private foodX: Array<number> = [];
  private foodY: Array<number> = [];

  constructor() {
    this.setupRandomXY();
    this.draw();
  }

  draw() {
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(this.x, this.y, CELL_SIZE, CELL_SIZE);

    ctx.fillStyle = COLOR_BACKGROUND;
    let miniCellSize = CELL_SIZE / 3;

    ctx.fillRect(
      this.x + miniCellSize,
      this.y + miniCellSize,
      miniCellSize,
      miniCellSize
    );
    ctx.fillRect(this.x, this.y, miniCellSize, miniCellSize);
    ctx.fillRect(
      this.x + miniCellSize * 2,
      this.y + miniCellSize * 2,
      miniCellSize,
      miniCellSize
    );
    ctx.fillRect(this.x + miniCellSize * 2, this.y, miniCellSize, miniCellSize);
    ctx.fillRect(this.x, this.y + miniCellSize * 2, miniCellSize, miniCellSize);
  }

  update() {
    this.draw();
  }

  setupRandomXY() {
    for (let i = 0; i <= canvas.width - CELL_SIZE; i += CELL_SIZE) {
      this.foodX.push(i);
      this.foodY.push(i);
    }

    this.x = this.foodX[Util.getRandomInt(0, this.foodX.length)];
    this.y = this.foodY[Util.getRandomInt(0, this.foodY.length)];
  }

  eaten() {
    this.setupRandomXY();
  }
}

class Snake {
  x: number = CELL_SIZE * 5;
  y: number = CELL_SIZE * 2;
  body: Array<any> = [];
  direction: string = 'RIGHT';
  frameCount: number = 0;

  constructor() {
    for (let i = 0; i < SNAKE_STARTING_LENGTH; i++) {
      this.body.push({ x: this.x + i * CELL_SIZE, y: this.y });
    }
    this.draw();
  }

  draw() {
    ctx.fillStyle = FOOD_COLOR;
    for (let j = 0; j < this.body.length; j++) {
      ctx.fillRect(this.body[j].x, this.body[j].y, CELL_SIZE, CELL_SIZE);
    }
  }

  grows() {
    let x, y;
    let tail = this.body[0];
    switch (this.direction) {
      case 'UP':
        y = CELL_SIZE + tail.y;
        x = tail.x;
        break;
      case 'DOWN':
        y = CELL_SIZE - tail.y;
        x = tail.x;
        break;
      case 'LEFT':
        x = CELL_SIZE + tail.x;
        y = tail.y;
        break;
      case 'RIGHT':
        x = CELL_SIZE - tail.y;
        y = tail.y;
        break;
    }
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    this.body.unshift({ x: x, y: y });
  }

  update() {
    this.move();
    this.draw();
  }

  move() {
    this.frameCount++;
    if (this.frameCount > MAX_FRAME_RATE) {
      let head = this.body.shift();

      head.y = this.body[this.body.length - 1].y;
      head.x = this.body[this.body.length - 1].x;

      switch (this.direction) {
        case 'UP':
          head.y -= CELL_SIZE;
          break;
        case 'DOWN':
          head.y += CELL_SIZE;
          break;
        case 'LEFT':
          head.x -= CELL_SIZE;
          break;
        case 'RIGHT':
          head.x += CELL_SIZE;
          break;
      }

      this.body.push(head);
      this.frameCount = 0;
    }
  }

  moveDown() {
    if (this.direction != 'UP') this.direction = 'DOWN';
  }

  moveLeft() {
    if (this.direction != 'RIGHT') this.direction = 'LEFT';
  }

  moveRight() {
    if (this.direction != 'LEFT') this.direction = 'RIGHT';
  }

  moveUp() {
    if (this.direction != 'DOWN') this.direction = 'UP';
  }
}

class Score {
  private score: number = 0;

  constructor() {
    this.draw();
  }

  draw() {
    let position = 20;
    ctx.fillStyle = COLOR_SCORE;
    ctx.fillText(String(this.score), position, 50);
  }

  update() {
    this.draw();
  }

  increment() {
    this.score += 5;
  }
}

class InputController {
  private snake: Snake;

  constructor(snake: Snake) {
    this.snake = snake;

    document.addEventListener(
      'keydown',
      (evt: KeyboardEvent) => {
        if (evt.key == 'ArrowUp') {
          this.snake.moveUp();
        } else if (evt.key == 'ArrowDown') {
          this.snake.moveDown();
        } else if (evt.key == 'ArrowLeft') {
          this.snake.moveLeft();
        } else if (evt.key == 'ArrowRight') {
          this.snake.moveRight();
        }
      },
      false
    );
  }
}

class Game {
  private score: Score = new Score();
  private snake: Snake = new Snake();
  private food: Food = new Food();
  private id: number;
  private oldTimestamp: any = new Date();

  constructor() {
    //Setup Components
    let inputController = new InputController(this.snake);

    this.id = requestAnimationFrame(this.gameLoop);
  }

  // Setup Game Area
  setup() {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '48px Verdana';
  }

  gameLoop(timestamp: any) {
    // Calculate the number of seconds passed since the last frame
    let secondsPassed = (timestamp - game.oldTimestamp) / 1000;
    game.oldTimestamp = timestamp;
    let fps = Math.round(1 / secondsPassed); // Calculate fps
    //console.log(fps)

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // use game object because of requewstAnimationFrame
    // calling function with this scope
    game.setup();

    game.food.update();
    game.snake.update();

    game.checkCollision();

    game.score.update();

    cancelAnimationFrame(game.id);
    game.id = requestAnimationFrame(game.gameLoop);
  }

  checkCollision() {
    this.snakeHitWall(this.snake);
    this.snakeEatsFood(this.snake, this.food);
    this.insideSnake(this.snake, this.food);
    this.hitSnake(this.snake);
  }

  snakeHitWall(snake: Snake) {
    let snakeBodyLength = snake.body.length;
    let head = snake.body[snakeBodyLength - 1];
    if (
      head.x < 0 ||
      head.x > canvas.width - CELL_SIZE ||
      head.y < 0 ||
      head.y > canvas.height - CELL_SIZE
    ) {
      cancelAnimationFrame(game.id);
      game = new Game();
    }
  }

  snakeEatsFood(snake: Snake, food: Food) {
    let snakeBodyLength = snake.body.length;
    let head = snake.body[snakeBodyLength - 1];
    if (head.x == food.x && head.y == food.y) {
      snake.grows();
      food.eaten();
      this.score.increment();
    }
  }

  insideSnake(snake: Snake, food: Food) {
    for (let i = 0; i < snake.body.length; i++) {
      if (snake.body[i].x == food.x && snake.body[i].y == food.y) {
        food.setupRandomXY();
      }
    }
  }

  hitSnake(snake: Snake) {
    let x = snake.body[snake.body.length - 1].x;
    let y = snake.body[snake.body.length - 1].y;

    for (let i = 0; i < snake.body.length - 2; i++) {
      //console.log(x + " " + y + " === " + snake.body[i].x + " " + snake.body[i].y)
      if (x == snake.body[i].x && y == snake.body[i].y) {
        // alert("hit snake")
        cancelAnimationFrame(game.id);
        game = new Game();
      }
    }
  }
}

let game = new Game();
