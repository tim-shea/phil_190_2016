var faust = new Bot(240, 220, 'faust', 'bots/faust/faust.png');

faust.stateText = "dragon";

faust.init = function() {
    this.body = this.sprite.body;  // Todo:  a way to automate this?
    faust.body.rotation = 100; // Initial Angle
    faust.body.speed = 100; // Initial Speed
    // Do something every n seconds.
    // game.time.events.loop(Phaser.Timer.SECOND * 1, faust.timedEvend, this);
}


//
// Example of a timed event
//
faust.timedEvend = function() {
    console.log(game.time.totalElapsedSeconds());   
}

faust.getStatus = function() {
    return faust.stateText;
}

faust.update = function() {
    if (Math.random() < .05) {
        faust.incrementAngle(10);
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            faust.body.speed = 500;
            faust.stateText = "Normal";
        } else {
            faust.body.speed = 0;
            faust.stateText = "Backwards";
        }
    }
    faust.basicUpdate();
};
