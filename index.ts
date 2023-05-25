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
  public direction: string;

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
        collisionEntry.objectA.x <
          collisionEntry.objectB.x + collisionEntry.objectB.width &&
        collisionEntry.objectA.x + collisionEntry.objectA.width >
          collisionEntry.objectB.x &&
        collisionEntry.objectA.y <
          collisionEntry.objectB.y + collisionEntry.objectB.height &&
        collisionEntry.objectA.y + collisionEntry.objectA.height >
          collisionEntry.objectB.y
      ) {
        collisionEntry.callback.apply(collisionEntry.scope, [
          collisionEntry.objectA,
          collisionEntry.objectB,
        ]);
      }
    }
    for (let wallCollisionEntry of this.wallCollisionRegister) {
      if (
        wallCollisionEntry.objectA.y < 0 ||
        wallCollisionEntry.objectA.y + wallCollisionEntry.objectA.height >
          canvas.height ||
        wallCollisionEntry.objectA.x < 0 ||
        wallCollisionEntry.objectA.x + wallCollisionEntry.objectA.width >
          canvas.width
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

/* --------------------------------- ENTITIES ------------------------------- */

class Food extends GameObject {
  private foodX: Array<number> = [];
  private foodY: Array<number> = [];

  constructor() {
    super();
    this.setupRandomXY();
    this.width = CELL_SIZE;
    this.height = CELL_SIZE;
  }

  update() {
    super.update();
  }

  render() {
    super.render();

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

class Snake extends GameObject {
  body: Array<any> = [];
  frameCount: number = 0;

  constructor() {
    super(new WASDInputController());
    this.direction = 'RIGHT';
    for (let i = 0; i < SNAKE_STARTING_LENGTH; i++) {
      this.body.push({ x: CELL_SIZE * 5 + i * CELL_SIZE, y: CELL_SIZE * 2 });
    }
    this.width = CELL_SIZE;
    this.height = CELL_SIZE;
  }

  update() {
    this.frameCount++;
    if (this.frameCount > MAX_FRAME_RATE) {
      super.update();
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
      this.x = head.x;
      this.y = head.y;

      this.frameCount = 0;
    }
  }

  render() {
    ctx.fillStyle = FOOD_COLOR;
    for (let j = 0; j < this.body.length; j++) {
      ctx.fillRect(this.body[j].x, this.body[j].y, CELL_SIZE, CELL_SIZE);
    }
  }

  grows() {
    let x: number, y: number;
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
}

class Score extends GameObject {
  private score: number = 0;

  constructor() {
    super();
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    ctx.font = '48px Verdana';
    ctx.fillStyle = COLOR_SCORE;
    ctx.fillText(String(this.score), 20, 50);
  }

  increment() {
    this.score += 5;
  }
}

/* ------------------------------- InputController  ----------------------------- */

class WASDInputController extends InputController {
  constructor() {
    super();
  }

  update(gameObject: GameObject) {
    var options: any = {
      position: { top: '90%', left: '50%' },
      mode: 'static',
    };
    var manager = nipplejs.create(options);

    manager.on('dir:down', () => {
      gameObject.direction = 'DOWN';
    });
    manager.on('dir:up', () => {
      gameObject.direction = 'UP';
    });
    manager.on('dir:left', () => {
      gameObject.direction = 'LEFT';
    });
    manager.on('dir:right', () => {
      gameObject.direction = 'RIGHT';
    });

    document.addEventListener(
      'keydown',
      (evt: KeyboardEvent) => {
        switch (evt.key) {
          case 'ArrowUp':
            gameObject.direction = 'UP';
            break;
          case 'ArrowDown':
            gameObject.direction = 'DOWN';
            break;
          case 'ArrowLeft':
            gameObject.direction = 'LEFT';
            break;
          case 'ArrowRight':
            gameObject.direction = 'RIGHT';
            break;
        }
      },
      false
    );
  }
}

/* --------------------------------- SCENE ------------------------------- */
class MainLevel extends Scene {
  private score: Score;
  private snake: Snake;
  private food: Food;

  constructor() {
    super();
  }

  create() {
    this.score = new Score();
    this.add(this.score);

    this.snake = new Snake();
    this.add(this.snake);

    this.food = new Food();
    this.add(this.food);

    this.physics.onCollide(this.snake, this.food, this.onSnakeEatsFood, this);
    this.physics.onCollideWalls(this.snake, this.onSnakeHitsWall, this);

    //food hits snake??
  }

  onSnakeHitsWall() {
    console.log('onSnakeHitWall');
    game = new Game(new MainLevel());
  }

  onSnakeEatsFood() {
    console.log('onSnakeEatsFood');
    this.snake.grows();
    this.food.eaten();
    this.score.increment();
  }

  onSnakeHitSnake() {
    for (let i = 0; i < this.snake.body.length - 1; i++) {
      if (
        this.snake.body[i].x == this.snake.x &&
        this.snake.body[i].y == this.snake.y
      ) {
        game = new Game(new MainLevel());
      }
    }
  }

  update() {
    super.update();

    //collision check for snake hitting snake
    this.onSnakeHitSnake();
  }

  render() {
    super.render();
  }
}

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */
let mainLevel = new MainLevel();
let game = new Game(mainLevel);

/**
BUGS
- When the food is on the top row it is not eaten 
*/

/** 
 TODO
 - make snake a different color
 - fix constants names to be COLOR_...
 - remove magic numbers
 */
