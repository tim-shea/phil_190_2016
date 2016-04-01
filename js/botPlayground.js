/**
 * @overview The Bot Playground: A semester-long class project for Phil 190, 
 * Spring 2016, at UC Merced. An experimental application that allows us to create 
 * simple bots with their own distinctive personalities, AI, etc.
 *
 * @author  Jeff Yoshimi, ... [list your name here]
 */

//
// Misc. global Variables
// 
var cursors;
var cursorDown;
var worldSizeX = 3000;
var worldSizeY = 3000;

// Phaser groups
var botGroup, entityGroup;

// Arrays and dictionaries
//
var bots = [jeff, sharAI, troi, yang, faust, maria, dylan, Daniel, duyen, rey];
var sprites = [];
var entities = [];
var foods = [];
var currentBotIndex = defaultBotIndex;
var sounds = {};

//
// Main game object. Size of visible region.
//
var game = new Phaser.Game(700, 700, Phaser.AUTO, 'canvasContainer', {
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
    game.load.image('Treehouse', 'assets/Deer_Treehouse.png');
    game.load.image('DeerCrossingSign', 'assets/deercrossing.png');
    game.load.image('grassyrock', 'assets/grassyrock.png');
    game.load.image('cave', 'assets/cave.png');
    game.load.image('princessCastle', 'assets/large_princess-castle-2.png');
    game.load.image('carousel', 'assets/carousel.png');
    game.load.image('shield', 'assets/bubble.png'); 
    game.load.image('pow', 'assets/pow.png');

    // Load sounds
    game.load.audio('cookiecat', 'assets/coockiecatinstrumental.m4a');
    game.load.audio('doozer', 'assets/doos.wav');
    game.load.audio('chomp', 'assets/chwl.wav');
    game.load.audio('drink', 'assets/drinkSound.mp3');
    // game.load.audio('wilhelm', 'assets/Wilhelm_Scream.wav')
    game.load.audio('snooze', 'assets/snooze.mp3');
    // game.load.audio('crash', 'assets/crash.mp3');
    game.load.audio('attack 1', 'assets/attacksound1.mp3');
    game.load.audio('collision', 'assets/collision_noise.mp3');
    game.load.audio('collision 2', 'assets/collision_noise2.wav');
    game.load.audio('collision 3', 'assets/collision_noise3.mp3');
    game.load.audio('collision 4', 'assets/collision_noise4.mp3');
    game.load.audio('collision 5', 'assets/collision_noise5.mp3');
    game.load.audio('beepbeep 00', 'assets/BeepBeep_roadrunner.mp3');
    game.load.audio('puuuu 00', 'assets/puuuu_00.mp3');
    game.load.audio('quote_batrider 00', 'assets/quote_batrider.mp3');
    game.load.audio('sleep 00', 'assets/sleep_00.mp3');

    // Load speech bubble assets
    loadSpeechBubbleAssets();

    // Load food items with a specified id and path
    game.load.image('food_fruit_veggies', 'assets/food_fruit_veggies.png');
    game.load.image('cupCake', 'assets/cupCakeSmaller.png');
    game.load.image('diet_pepsi', 'assets/diet_pepsi.png');
    game.load.image('jerry_can', 'assets/jerry_can.png');
    game.load.image('Philoberry', 'assets/Philoberry.png');
    game.load.image('Cheri_berry', 'assets/Cheri_Berry.png');
    game.load.image('Enigma_berry', 'assets/Enigma_Berry.png');
    game.load.image('Hondew_berry', 'assets/Hondew_Berry.png');
    game.load.image('Passo_berry', 'assets/Passo_Berry.png');
    game.load.image('Devil_Fruit_rubber', 'assets/gomu_gomu_no_mi.png');
    game.load.image('steak', 'assets/steak.gif');
    game.load.image('pink_candy', 'assets/pink_candy.png');
    game.load.image('Cream_Cake', 'assets/Cream_Cake.png');
    game.load.image('Spicy_Poffin', 'assets/Spicy_Poffin.png');

}

/**
 * Set up the simulation
 */
function create() {

    // Set world size
    game.world.setBounds(0, 0, worldSizeX, worldSizeY);

    // Set up the land
    game.add.tileSprite(0, 0, worldSizeX, worldSizeY, 'background');

    // Add group for bots
    botGroup = game.add.group();
    foodGroup = game.add.group();
    entityGroup = game.add.group();

    // Set up sprites
    for (var i = 0; i < bots.length; i++) {
        var newSprite = botGroup.create(bots[i].x, bots[i].y, bots[i].name);
        newSprite.anchor.setTo(0.5, 0.5); // Sets the center of rotation, I think in the coordinates of the sprite
        bots[i].sprite = newSprite;
        bots[i].body = newSprite.body;
        game.physics.enable(newSprite, Phaser.Physics.ARCADE);
        sprites.push(newSprite);
        bots[i].init();
        // bots[i].body.mass = 10;
        // bots[i].body.bounce.x = 5;
        // bots[i].body.bounce.y = 5;
        bots[i].speechBubble;
    }

    // Set up static entities.  Give it an x and y coordinate.  
    //      The third argument (e.g. 'oakTree') must match the name used
    //      above in the pre-load function 

    // web has been seperated from entities so that bots can walk over it
    game.add.sprite(2755, 0, 'web');
    entities.push(new Entity(400, 400, 'oakTree'));
    entities.push(new Entity(1000, 2000, 'oakTree'));
    entities.push(new Entity(2900, 130, 'cocoon'));
    entities.push(new Entity(600, 2198, 'singlerock'));
    entities.push(new Entity(1500, 1500, 'singlerock'));
    entities.push(new Entity(730, 320, 'rock'));
    entities.push(new Entity(600, 2000, 'statue'));
    entities.push(new Entity(1000, 1000, 'stray dog'));
    entities.push(new Entity(1200, 1200, 'Cherry Blossom Tree'));
    entities.push(new Entity(25, 2700, 'Eastern Castle'));
    entities.push(new Entity(10, 2930, 'Treasure'));
    entities.push(new Entity(2700, 2700, 'Treehouse'));
    entities.push(new Entity(2700, 2800, 'DeerCrossingSign'));
    entities.push(new Entity(50, 300, 'grassyrock'));
    entities.push(new Entity(-100, -100, 'cave', game));
    entities.push(new Entity(1000, 1350, 'princessCastle'));
    entities.push(new Entity(600, 1200, 'carousel'));

    // Set up food items
    setUpFood();

    // Make static entities immovable
    entityGroup.forEach(function(entity) {
            entity.body.immovable = true;
            entity.body.moves = false;
        },
        this);

    // Set up global sounds
    sounds.coockiecatinstrumental = game.add.audio('cookiecat', undefined, true, undefined);
    sounds.chomp = game.add.audio('chomp');
    sounds.snooze = game.add.audio('snooze')
    sounds.collision_noise3 = game.add.audio('collision 3');
    sounds.collision_noise4 = game.add.audio('collision 4');
    sounds.collision_noise5 = game.add.audio('collision 5');
    sounds.beepbeep_00 = game.add.audio('beepbeep 00');
    sounds.puuuu_00 = game.add.audio('puuuu 00');
    sounds.quote_batrider_00 = game.add.audio('quote_batrider 00');
    sounds.sleep_00 = game.add.audio('sleep 00');

    // Code below places bots on top of entities
    // game.world.bringToTop(botGroup);

    // Make camera follow the agent
    game.camera.follow(sprites[currentBotIndex]);

    // Set up keyboard input
    cursors = game.input.keyboard.createCursorKeys();

    // Update selection box
    document.getElementById("botSelect").selectedIndex = defaultBotIndex;

    // Init network
    botSelect();
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
            bots[i].genericUpdate();
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
    
    // Update memory net each time bot is selected
    memoryData  = {
        nodes: bots[currentBotIndex].nodes,
        edges: bots[currentBotIndex].edges
    };
    currentNetwork = new vis.Network(document.getElementById('mynetwork'), memoryData, bots[currentBotIndex].options);
}

//
// Find a location in the botplayground that is unoccupied by any static entity
//
function findEmptyLocation() {
    while (true) {
        let x = Math.random() * worldSizeX;
        let y = Math.random() * worldSizeX;
        if (game.physics.arcade.getObjectsAtLocation(x, y, entityGroup).length == 0) {
            return [x, y];
        }
    }
}

//
// Can be used to render text to the canvas
//
function render() {
    // game.debug.text('Bots: ' + bots.length, 32, 32);

    // Uncomment the next 6 lines to see bounding boxes
    // bots.forEach(function(bot) {
    //     game.debug.body(bot);
    // });
    // entities.forEach(function(entity) {
    //     game.debug.body(entity.sprite);
    // });

}
