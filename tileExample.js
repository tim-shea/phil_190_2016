//
// Simple Canvas program adapted from this demo:
// http://phaser.io/examples/v2/games/tanks
//
// NOTE: This is highly provisional, and may completely evolve to something
//      else before we start making regular use of it
//

//
// Main Variables
// 
var land;
var agent;
var currentSpeed = 0;
var cursors;

//
// Main game object. Size of visible region.
//
var game = new Phaser.Game(500,500, Phaser.AUTO, 'canvasContainer', {
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
    game.load.atlas('agent', 'assets/tanks.png', 'assets/tanks.json');
    game.load.image('background', 'assets/light_grass.png');
}

//
// Set up the simulation
//
function create() {

    // Set world size
    game.world.setBounds(0, 0, 2000, 2000);

    // Set up the land
    land = game.add.tileSprite(0, 0, 2000, 2000, 'background');

    // Add the agent
    agent = game.add.sprite(200, 250, 'agent', 'tank1');
    agent.angle = -135;
    agent.anchor.setTo(0.5, 0.5);  // Related to center of rotation

    // Make camera follow the agent
    game.camera.follow(agent);
    // game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    // game.camera.focusOnXY(0, 0);

    // Randomly change agent's heading every second
    game.time.events.loop(Phaser.Timer.SECOND * .5, updateAgentAngle, this);

    // Other world parameters
    game.physics.enable(agent, Phaser.Physics.ARCADE);
    agent.body.collideWorldBounds = true;

    // Set up keyboard input
    cursors = game.input.keyboard.createCursorKeys();

}

//
// Main update function
//
function update() {

    // Set Speed
    if(Math.random() < .8) {
        currentSpeed = 100;        
    } else {
        currentSpeed = -40;
    }

    // Handle Edge Hitting Events
    bounceOffBounds();

    // Arrow keys
    if (cursors.left.isDown) {
        agent.angle -= 4;
    } else if (cursors.right.isDown) {
        agent.angle += 4;
    }
    if (cursors.up.isDown) {
        currentSpeed = 300;
    } else if (cursors.down.isDown) {
        currentSpeed = -300;
    }

    // Update agent
    game.physics.arcade.velocityFromRotation(agent.rotation, currentSpeed, agent.body.velocity);
}

//
// Handle wall events
//
function bounceOffBounds() {
    // console.log(game.world.bounds);
    // console.log(agent.body.x+','+agent.body.y);
    // TODO: Redo without the 10/50 fudges, based on the size of the agent
    if (agent.body.x < (game.world.bounds.x + 10)) {
        agent.angle += 180;
    }
    if (agent.body.y < (game.world.bounds.y + 10)) {
        agent.angle += 180;
    }
    if (agent.body.x > game.world.bounds.width - 60) {
        agent.angle += 180;
    }
    if (agent.body.y > game.world.bounds.height - 60) {
        agent.angle += 180;
    }

}

//
// Update heading of main agent
//
function updateAgentAngle() {
        agent.angle += 20 * (2 * Math.random() - 1);
}

//
// Currently just used for debugging
//
function render() {

    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    // game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);

}
