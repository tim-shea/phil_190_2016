/*var troi = new Bot(250, 250, 'troi', 'bots/troi/umbreon_2.0.png');
troi.incrementAngle = 50;
troi.body.speed = 100;



troi.init = function() {
    this.body = this.sprite.body; // Todo:  a way to automate this?
    troi.body.rotation = 100; // Initial Angle
    troi.body.speed = 100; // Initial Speed
    // Do something every n seconds.
    // game.time.events.loop(Phaser.Timer.SECOND * 1, troi.timedEvend, this);
}
troi.update = function() {
        if (Math.random() < .1) {
            troi.incrementAngle += .5;
        } else {
            troi.incrementAngle -= 2;
        }
        if (Math.random() < 0.1) {
            if (Math.random() < 0.05) {
                troi.body.speed = 10;
            } else {
                troi.body.speed = 100;
            }
            troi.basicUpdate();

        };
    };
*/

var troi = new Bot(540, 520, 'troi', 'bots/troi/umbreon_2.0.png');

troi.stateText = "Whatever"; // Note this will change once we implement our state machines

// Things to be updated for new code:
//  - Must add the bot.init function and similar lines to the ones I have
//  - Changing angle and speed now happens on bot.body, or using bot.incrementAngle
//  - Moved bot.angle, bot.speed to the bot.init function as below.
//  - At the end of the update function I must call bot.basicUpdate()

troi.init = function() {
    this.body = this.sprite.body;  // Todo:  a way to automate this?
    troi.body.rotation = 100; // Initial Angle
    troi.body.speed = 100; // Initial Speed
    // Do something every n seconds.
    // game.time.events.loop(Phaser.Timer.SECOND * 1, troi.timedEvend, this);
}

//
// Example of a timed event
//
troi.timedEvend = function() {
    console.log(game.time.totalElapsedSeconds());   
}

troi.getStatus = function() {
    return troi.stateText;
}

troi.update = function() {
    if (Math.random() < .05) {
        troi.incrementAngle(10);
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            troi.body.speed = 500;
            troi.stateText = "Spastic!";
        } else {
            troi.body.speed = 0;
            troi.stateText = "Chilling....";
        }
    }
    troi.basicUpdate();
};
