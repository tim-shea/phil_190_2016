//
// Simple Canvas program adapted from this demo:
// http://phaser.io/examples/v2/games/tanks
//

//
// Main Variables
// 
var land;
var cursors;
var speedOverride;
var override;

//
// Arrays of bots
//
var bots = [jeff, mouse];
// For now keeping the phaser sprites and logical objects separate;
//   extending sprite ended up being too complex after 20 minutes of effort
var sprites = [];
var currentBotIndex = 0;

//
// Main game object. Size of visible region.
//
var game = new Phaser.Game(500, 500, Phaser.AUTO, 'canvasContainer', {
    preload: preload,
    create: create,
    update: update,
    render: render
});
// TODO: String height and width not working above

//
// Pre-load  assets
//
function preload() {
    game.load.image('background', 'assets/grass.jpg');
    for (var i = 0; i < bots.length; i++) {
        game.load.image(bots[i].name, bots[i].imagePath);
    };
}

//
// Set up the simulation
//
function create() {

    // Set world size
    game.world.setBounds(0, 0, 1000, 1000);

    // Set up the land
    land = game.add.tileSprite(0, 0, 1000, 1000, 'background');

    // Set up sprites
    for (var i = 0; i < bots.length; i++) {
        var newSprite = game.add.sprite(bots[i].x, bots[i].y, bots[i].name);
        newSprite.angle = bots[i].angle;
        newSprite.anchor.setTo(0.5, 0.5); // Sets the center of rotation, I think in the coordinates of the sprite
        bots[i].init(game);
        game.physics.enable(newSprite, Phaser.Physics.ARCADE);
        sprites.push(newSprite);
    }

    // Make camera follow the agent
    game.camera.follow(sprites[currentBotIndex]);

    // Set up keyboard input
    cursors = game.input.keyboard.createCursorKeys();
}

//
// Main update function
//
function update() {

    // Handle Edge Hitting Events
    bounceOffBounds();

    // Arrow keys
    if (cursors.left.isDown) {
        bots[currentBotIndex].angle -= 4;
    } else if (cursors.right.isDown) {
        bots[currentBotIndex].angle += 4;
    }
    if (cursors.up.isDown) {
        override = true;
        speedOverride = 300;
    } else if (cursors.down.isDown) {
        override  = true;
        speedOverride = -300;
    } else {
        override = false;
    }

    // Update bots
    for (var i = 0; i < sprites.length; i++) {
        sprites[i].angle = bots[i].angle;
        if(i === currentBotIndex & (override === true)) {
            game.physics.arcade.velocityFromRotation(sprites[i].rotation, speedOverride, sprites[i].body.velocity);
        } else {
            bots[i].update();
            game.physics.arcade.velocityFromRotation(sprites[i].rotation, bots[i].speed, sprites[i].body.velocity);
        }
    }

}

//
// Handle wall events
//
function bounceOffBounds() {
    // console.log(game.world.bounds);
    // console.log(agent.body.x+','+agent.body.y);
    // TODO: Redo without the 10/50 fudges, based on the size of the agent
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].body.x < (game.world.bounds.x + 10)) {
            bots[i].angle += 180;
        }
        if (sprites[i].body.y < (game.world.bounds.y + 10)) {
            bots[i].angle += 180;
        }
        if (sprites[i].body.x > game.world.bounds.width - 60) {
            bots[i].angle += 180;
        }
        if (sprites[i].body.y > game.world.bounds.height - 60) {
            bots[i].angle += 180;
        }
    }
}

//
// Select the current bot to focus on.  Called by html.
//
function botSelect() {
    var e = document.getElementById("botSelect");
    newIndex = e.selectedIndex;
    console.log(newIndex);
    game.camera.follow(sprites[newIndex]);
    currentBotIndex = newIndex;
}

//
// Can be used to render text to the canvas
//
function render() {

    // game.debug.text('Bots: ' + bots.length, 32, 32);

}
