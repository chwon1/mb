"use strict";


/******* Global variables *******/

const height = 400;
const width = 400;
const platformHeight = 15;
const platformWidth = 50;
const platformLocations = [
  { x: 50, y: 200 },
  { x: 200, y: 300 },
  { x: 130, y: 100 },
  { x: 290, y: 150 },
];
const playerProps = {
  vx: 200, // "v" for velocity
  vy: 450,
  gravity: 800,
  height: 30,
  width: 30,
};
const imageFiles = [
  { name: "player", path: "assets/box.png" },
  { name: "floor", path: "assets/floor.png" },
  { name: "platform", path: "assets/platform.png" },
];

let kbd;
let player;
let platforms;

// Create the Phaser game
const game = new Phaser.Game(
  width, height, Phaser.AUTO, "example", 
  { preload: preload, create: create, update: update }
);

/********************************/

// Phaser function to load assets and set up the game
function preload() {
  imageFiles.forEach(e => game.load.image(e.name, e.path));
  kbd = game.input.keyboard.createCursorKeys();
}

/********************************/

// Phaser function to set up the initial gamestate
function create() { 

  // Gentlefolk, start your physics engines
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Make the platforms group array
  platforms = game.add.group();
  platforms.enableBody = true;
  platforms.create(
    0, game.world.height - platformHeight, "floor"
  ).body.immovable = true;

  // Make all the ledges and set them to be immovable
  platformLocations.forEach(e => 
    platforms.create(e.x, e.y, "platform").body.immovable = true
  );

  // Create the player object
  player = game.add.sprite(
    30, height - playerProps.height, "player"
  );
  player.anchor.set(0.5);

  // Initialize the player's physics properties
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.gravity.y = playerProps.gravity;
  player.body.collideWorldBounds = true;
}

/********************************/

// Phaser function to update and render the game each frame
function update() {

  // Collide the player and platforms
  game.physics.arcade.collide(player, platforms);

  // Handle player horizontal movement
  if (kbd.left.isDown) {
    player.body.velocity.x = -playerProps.vx;
    player.angle = 180;
  }
  else if (kbd.right.isDown) {
    player.body.velocity.x = playerProps.vx;
    player.angle = 0;
  }
  else {
    player.body.velocity.x = 0;
  }

  // Handle player jumps
  if (kbd.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -playerProps.vy;
    player.angle = 270;
  }
}
