//
// Simple Canvas program adapted from this demo:
// http://phaser.io/examples/v2/games/tanks
//
var game = new Phaser.Game(500, 500, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.atlas('agent', 'assets/tanks.png', 'assets/tanks.json');
    game.load.image('earth', 'assets/light_grass.png');
}

var land;
var agent;
var currentSpeed = 0;
var cursors;

function create() {

    // Set up the land
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    // Add the agent
    agent = game.add.sprite(150, 150, 'agent', 'tank1');
    agent.angle = -135;
    agent.anchor.setTo(0.5, 0.5); 
    // TODO: Not clear on anchor.  Related to center of rotation.
    //  See http://www.html5gamedevs.com/topic/2985-how-to-set-center-of-rotation/

    // Randomly change agent's heading every second
    game.time.events.loop(Phaser.Timer.SECOND * 1, updateAgentAngle, this);


    game.physics.enable(agent, Phaser.Physics.ARCADE);
    agent.body.collideWorldBounds = true;


    // Set up keyboard input
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    // Crazy behavior
    // currentSpeed += 20 * (2 * Math.random() - 1);
    // agent.angle += 10 * (2 * Math.random() - 1);        

    // Random straights and turns at fixed intervals
    currentSpeed = 100
    if(Math.random() > .8) {
        currentSpeed = -50;        
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

function updateAgentAngle() {
        agent.angle += 20 * (2 * Math.random() - 1);
}

function render() {

    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    // game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);

}
