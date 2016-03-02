// // Simple Canvas program adapted from this demo:
// http://phaser.io/examples/v2/games/tanks
//

//
// Global Variables
// 
var cursors;
var cursorDown;
var botGroup;

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
    game.load.image('Eastern Castle', 'assets/eastCastle.png');
    game.load.image('Treasure', 'assets/treasurechest.gif');
    game.load.image('Philoberry', 'bots/yang/Philoberry.png');
    game.load.image('Treehouse', 'bots/yang/Deer_Treehouse.png');
    game.load.image('DeerCrossingSign', 'bots/yang/deercrossing.png');
    game.load.image('grassyrock', 'assets/grassyrock.png');
    game.load.image('cave', 'assets/cave.png');
    game.load.image('princessCastle', 'assets/large_princess-castle-2.png');
    game.load.image('carousel', 'assets/carousel.png');
    game.load.image('greenTree', 'assets/greenTree.png');
    game.load.image('pinkTree', 'assets/pinkTree.png');

    // Load sounds
    game.load.audio('doozer', 'assets/doos.wav');
    game.load.audio('chomp', 'assets/chwl.wav');
}

//
// Set up the simulation
//
function create() {

    // Set world size
    game.world.setBounds(0, 0, 3000, 3000);

    // Set up the land
    game.add.tileSprite(0, 0, 3000, 3000, 'background');

    // Add group for bots
    botGroup = game.add.group();

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
    var web = new Entity(2755, 0, 'web', game);
    var oakTree1 = new Entity(400, 400, 'oakTree');
    var oakTree2 = new Entity(1000, 2000, 'oakTree');
    var cocoon = new Entity(2900, 130, 'cocoon');
    var rock = new Entity(600, 2198, 'singlerock');
    var rock2 = new Entity(1500, 1500, 'singlerock');
    var rock = new Entity(730, 320, 'rock');
    var statue = new Entity(600, 2000, 'statue');
    var dog = new Entity(1000, 1000, 'stray dog');
    var Blossom = new Entity(1200, 1200, 'Cherry Blossom Tree');
    var EasternCastle = new Entity(25, 2700, 'Eastern Castle');
    var treasure_1 = new Entity(10, 2930, 'Treasure');
    var philoberry = new Entity(2500, 2500, 'Philoberry');
    var treehouse = new Entity(2700, 2700, 'Treehouse');
    var deercrossingsign = new Entity(2700, 2800, 'DeerCrossingSign');
    var grassyrock = new Entity(50, 300, 'grassyrock');
    var cave = new Entity(-100, -100, 'cave', game);
    var princessCastle = new Entity(1000, 1350, 'princessCastle');
    var carousel = new Entity(600, 1200, 'carousel');
    var greenTree = new Entity(1000, 2700, 'greenTree');
    var pinkTree = new Entity(50, 1800, 'pinkTree');

    // Code below places bots on top of entities
    // game.world.bringToTop(botGroup);

    // Make camera follow the agent
    game.camera.follow(sprites[currentBotIndex]);

    // Set up keyboard input
    cursors = game.input.keyboard.createCursorKeys();

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
