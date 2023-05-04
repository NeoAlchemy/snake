import * as nipplejs from 'nipplejs';

// Import stylesheets
import './style.css';

/* -------------------------------------------------------------------------- */
/*                                MINI FRAMEWORK.                             */
/* -------------------------------------------------------------------------- */

// boiler plate setup the canvas for the game
var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = '4px solid #2F5300';
canvas.focus();

// utility functions to use everywhere
class Util {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// Input Controller to use everywhere
class InputController {
  public x: number;
  public y: number;

  constructor() {}

  update(gameObject: GameObject) {}
}

class GameObject {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  private inputController: InputController;

  constructor(inputController?) {
    this.inputController = inputController;
  }

  update() {
    this.inputController?.update(this);
  }

  render() {}
}

class Physics {
  private gameObjectCollisionRegister: Array<any> = [];
  private wallCollisionRegister: Array<any> = [];
  private objectA: GameObject;
  private objectB: GameObject;

  constructor() {}

  onCollide(
    objectA: GameObject,
    objectB: GameObject,
    callback: Function,
    scope: any
  ) {
    if (objectA && objectB) {
      this.gameObjectCollisionRegister.push({
        objectA: objectA,
        objectB: objectB,
        callback: callback,
        scope: scope,
      });
    }
  }

  onCollideWalls(objectA: GameObject, callback: Function, scope: any) {
    if (objectA) {
      this.wallCollisionRegister.push({
        objectA: objectA,
        callback: callback,
        scope: scope,
      });
    }
  }

  update() {
    for (let collisionEntry of this.gameObjectCollisionRegister) {
      if (
        collisionEntry.objectA.x > 0 &&
        collisionEntry.objectA.x < canvas.width &&
        collisionEntry.objectA.y > 0 &&
        collisionEntry.objectA.y < canvas.height &&
        collisionEntry.objectB.x > 0 &&
        collisionEntry.objectB.x < canvas.width &&
        collisionEntry.objectB.y > 0 &&
        collisionEntry.objectB.y < canvas.height &&
        collisionEntry.objectA.x >= collisionEntry.objectB.x &&
        collisionEntry.objectA.x <=
          collisionEntry.objectB.x + collisionEntry.objectB.width &&
        collisionEntry.objectA.y >= collisionEntry.objectB.y &&
        collisionEntry.objectA.y <=
          collisionEntry.objectB.y + collisionEntry.objectB.height
      ) {
        collisionEntry.callback.bind(collisionEntry.scope).apply();
      }
    }
    for (let wallCollisionEntry of this.wallCollisionRegister) {
      if (
        wallCollisionEntry.objectA.y < wallCollisionEntry.objectA.height ||
        wallCollisionEntry.objectA.y > canvas.height ||
        wallCollisionEntry.objectA.x < wallCollisionEntry.objectA.width ||
        wallCollisionEntry.objectA.x > canvas.width
      ) {
        wallCollisionEntry.callback.bind(wallCollisionEntry.scope).apply();
      }
    }
  }
}

class Scene {
  public children: Array<any>;
  public physics: Physics;

  constructor() {
    this.children = [];
    this.physics = new Physics();
  }

  add(gameObject: GameObject) {
    this.children.push(gameObject);
  }

  create() {}

  update() {
    for (let gameObject of this.children) {
      gameObject.update();
    }
    this.physics.update();
  }

  render() {
    // update the game background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let gameObject of this.children) {
      gameObject.render();
    }
  }
}

class Game {
  private scene: Scene;
  private id: number;

  constructor(scene: Scene) {
    this.scene = scene;
    this.scene.create();
    //Setup Components
    this.id = requestAnimationFrame(this.gameLoop);
  }

  gameLoop(timestamp) {
    // WARNING: This pattern is not using Times Step and as such
    // Entities must be kept low, when needing multiple entities, scenes,
    // or other components it's recommended to move to a Game Framework

    // game lifecycle events
    game.scene.update();
    game.scene.render();

    // call next frame
    cancelAnimationFrame(game.id);
    game.id = requestAnimationFrame(game.gameLoop);
  }
}

/* -------------------------------------------------------------------------- */
/*                               GAME SPECIFIC CODE                           */
/* -------------------------------------------------------------------------- */

/* ------------------------------ GAME MECHANICS ---------------------------- */



const CELL_SIZE = 20;
const SNAKE_STARTING_LENGTH = 5;
const COLOR_BACKGROUND = '#96C400';
const COLOR_SCORE = '#2F5300';
const FOOD_COLOR = '#2F5300';
const MAX_FRAME_RATE = 20;

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
    var options: any = {
      position: { top: '90%', left: '50%' },
      mode: 'static',
    };
    var manager = nipplejs.create(options);

    manager.on('dir:down', () => {
      this.snake.moveDown();
    });
    manager.on('dir:up', () => {
      this.snake.moveUp();
    });
    manager.on('dir:left', () => {
      this.snake.moveLeft();
    });
    manager.on('dir:right', () => {
      this.snake.moveRight();
    });

    document.addEventListener(
      'keydown',
      (evt: KeyboardEvent) => {
        switch (evt.key) {
          case 'ArrowUp':
            this.snake.moveUp();
            break;
          case 'ArrowDown':
            this.snake.moveDown();
            break;
          case 'ArrowLeft':
            this.snake.moveLeft();
            break;
          case 'ArrowRight':
            this.snake.moveRight();
            break;
        }
      },
      false
    );

    /** MOUSE SWIPE **/
    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchmove', handleTouchMove, false);

    let xDown = null;
    let yDown = null;

    function handleTouchStart(evt) {
      xDown = evt.originalEvent.touches[0].clientX;
      yDown = evt.originalEvent.touches[0].clientY;
    }

    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }

      let xUp = evt.originalEvent.touches[0].clientX;
      let yUp = evt.originalEvent.touches[0].clientY;

      let xDiff = xDown - xUp;
      let yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          this.snake.moveLeft();
        } else {
          this.snake.moveRight();
        }
      } else {
        if (yDiff > 0) {
          this.snake.moveUp();
        } else {
          this.snake.moveDown();
        }
      }
      /* reset values */
      xDown = null;
      yDown = null;
    }
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

/** 
 TODO
 - make snake a different color
 - fix constants names to be COLOR_...
 - remove magic numbers
 - better way to handle gameobjects
 - better way to handle collisions
 */
