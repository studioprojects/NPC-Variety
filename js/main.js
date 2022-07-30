/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1'); // game canvas
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 800;

class Game { // game class
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.enemies = [];
        this.enemyInterval = 1000; // interval between enemies
        this.enemyTimer = 0; // counts from 0 to 400
        console.log(this.enemies)
    }
    update(deltaTime) {
        this.enemies = this.enemies.filter(object => !object.markedForDeletion);
        if (this.enemyTimer > this.enemyInterval) {
            this.#addNewEnemy();
            this.enemyTimer = 0;
            console.log(this.enemies)
        } else {
            this.enemyTimer += deltaTime;
        }

        this.enemies.forEach(object => object.update());
    }
    draw() {
        this.enemies.forEach(object => object.draw(this.ctx));
    }
    #addNewEnemy() { // private method
        this.enemies.push(new Worm(this));
    }
} // end game class

class Enemy { // enemy class
    constructor(game) {
        this.game = game;
        this.markedForDeletion = false;
    }
    update() {
        this.x--;
        // remove enemies
        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }
    }
    draw(ctx) {
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
} // end enemy class

class Worm extends Enemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 229;
        this.spriteHeight = 171;
        this.x = this.game.width; // start at edge of game
        this.y = Math.random() * this.game.height;
        this.width = 200;
        this.height = 100;
        this.image = new Image();
        this.image.src = './img/worm.png';
    }
}

const game = new Game(ctx, canvas.width, canvas.height);

let lastTime = 1;
function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime);
    game.draw();

    requestAnimationFrame(animate); // serves based on refresh rate (recursively)
} // end animate function

animate(0); // run animate function (passing in 0 prevents NaN from first timeStamp iteration)