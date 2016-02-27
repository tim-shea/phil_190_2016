//
// Simple Canvas program adapted from this demo:
// http://phaser.io/examples/v2/games/tanks
//

//
// Main Variables
// 
var land;
var cursors;
var cursorDown;
var textArea;

//
// Arrays of bots
//
var bots = [jeff, sharAI, troi, yang, faust, maria, dylan, Daniel, duyen, rey];
var sprites = [];
var currentBotIndex = defaultBotIndex;

//
// Main game object. Size of visible region.
//
var game = new Phaser.Game(500, 500, Phaser.AUTO, 'canvasContainer', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

//
// Pre-load  assets
//
function preload() {
    // Load all assets
    game.load.image('background', 'assets/grass.jpg');

    // Load bot images as assets
    for (var i = 0; i < bots.length; i++) {
        game.load.image(bots[i].name, bots[i].imagePath);
    };

    // Load all entity sprites.  The first argument (e.g. 'oakTree')
    //   will be used as the name of this image below.
    game.load.image('oakTree', 'assets/oakTree.png');
    game.load.image('web', 'assets/web.png');
    game.load.image('cocoon', 'assets/cocoon.png');
    game.load.image('singlerock', 'assets/rock.png');
    game.load.image('rock', 'assets/rock_formation.png');
    game.load.image('statue', 'assets/statue_man.png'); 
    game.load.image('stray dog', 'assets/dog.png');
    game.load.image('Cherry Blossom Tree', 'assets/Blossom.png');
    //by Troi
    game.load.image('Eastern Castle', 'assets/eastCastle.png');
    game.load.image('Treasure', 'assets/treasurechest.gif')
    //

    // Load sounds
    game.load.audio('doozer', 'assets/doos.wav');
}

//
// Set up the simulation
//
function create() {

    // Enable Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Set world size
    game.world.setBounds(0, 0, 3000, 3000);

    // Set up the land
    land = game.add.tileSprite(0, 0, 3000, 3000, 'background');

    // Add group for bots
    var botGroup = game.add.group();

    // Background static entities load before everything else
    var web = new Entity (2755, 0, 'web', game);

    // Set up sprites
    for (var i = 0; i < bots.length; i++) {
        var newSprite = botGroup.create(bots[i].x, bots[i].y, bots[i].name);
        newSprite.anchor.setTo(0.5, 0.5); // Sets the center of rotation, I think in the coordinates of the sprite
        bots[i].sprite = newSprite;
        bots[i].body = newSprite.body;
        game.physics.enable(newSprite, Phaser.Physics.ARCADE);
        sprites.push(newSprite);
        newSprite.body.collideWorldBounds = true;
        bots[i].init();
    }

    // Set up static entities.  Give it an x and y coordinate.  
    //      The thir argument (e.g. 'oakTree') must match the name used
    //      above in the pre-load function 
    var oakTree1 = new Entity(400, 400, 'oakTree', game);
    var oakTree2 = new Entity(1000, 2000, 'oakTree', game);
    var cocoon = new Entity (2900, 130, 'cocoon', game);
    var rock = new Entity(600, 2198, 'singlerock', game);
    var rock2 = new Entity(1500, 1500,'singlerock', game);
    var rock = new Entity (730 , 320, 'rock', game);
    var statue = new Entity(600, 2000, 'statue', game);
    var dog = new Entity (1000, 1000, 'stray dog', game);
    var Blossom = new Entity (1200, 1200, 'Cherry Blossom Tree', game);
    //by Troi
    var EasternCastle = new Entity(25, 2700, 'Eastern Castle', game);
    var treasure_1 = new Entity(10, 2930, 'Treasure', game);
    //



    

    // Make camera follow the agent
    game.camera.follow(sprites[currentBotIndex]);

    // Set up keyboard input
    cursors = game.input.keyboard.createCursorKeys();

    // Text area to log agent states
    textArea = document.getElementById("textArea");

    // Update selection box
    document.getElementById("botSelect").selectedIndex = defaultBotIndex;


}

//
// Main update function
//
function update() {

    // Arrow keys
    if (cursors.left.isDown) {
        cursorDown = true;
        sprites[currentBotIndex].body.rotation -= 4;
    } else if (cursors.right.isDown) {
        cursorDown = true;
        sprites[currentBotIndex].body.rotation += 4;
    }
    if (cursors.up.isDown) {
        cursorDown = true;
        sprites[currentBotIndex].body.speed = 300;
    } else if (cursors.down.isDown) {
        cursorDown = true;
        sprites[currentBotIndex].body.speed = 0;
    }

    // Update bots
    for (var i = 0; i < bots.length; i++) {
        // When cursor is down, perform "cursor override" update
        //   for current bot
        if (cursorDown && i == currentBotIndex) {
            bots[i].basicUpdate();
            cursorDown = false;
        } else {               
            bots[i].update();
        }
    }

    // Update the text area
    document.textArea.logText.value = bots[currentBotIndex].getStatus();
    // Todo. text history

}

//
// Select the current bot to focus on.  Called by html.
//
function botSelect() {
    var e = document.getElementById("botSelect");
    newIndex = e.selectedIndex;
    game.camera.follow(sprites[newIndex]);
    currentBotIndex = newIndex;
}

//
// Can be used to render text to the canvas
//
function render() {
    // game.debug.text('Bots: ' + bots.length, 32, 32);
}

