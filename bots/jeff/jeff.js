var jeff = new Bot(540, 520, 'jeff', 'bots/jeff/person.png');

jeff.stateText = "Whatever"; // Note this will change once we implement our state machines

// Things to be updated for new code:
//  - Must add the bot.init function and similar lines to the ones I have
//  - Changing angle and speed now happens on bot.body, or using bot.incrementAngle
//  - Moved bot.angle, bot.speed to the bot.init function as below.
//  - At the end of the update function I must call bot.basicUpdate()

jeff.init = function() {
    this.body = this.sprite.body;  // Todo:  a way to automate this?
    jeff.body.rotation = 100; // Initial Angle
    jeff.body.speed = 100; // Initial Speed
    // Do something every n seconds.
    // game.time.events.loop(Phaser.Timer.SECOND * 1, jeff.timedEvend, this);
}

//
// Example of a timed event
//
jeff.timedEvend = function() {
    console.log(game.time.totalElapsedSeconds());   
}

jeff.getStatus = function() {
    return jeff.stateText;
}

jeff.update = function() {
    if (Math.random() < .05) {
        jeff.incrementAngle(10);
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            jeff.body.speed = 500;
            jeff.stateText = "Spastic!";
        } else {
            jeff.body.speed = 0;
            jeff.stateText = "Chilling....";
        }
    }
    jeff.basicUpdate();
};
