var rey = new Bot(240, 220, 'rey', 'bots/rey/whitedeer.png');
// rey.body.angle = 100; // Initial Angle
// rey.body.speed = 100; // Initial Speed
// rey.body.rotation = 100; 


rey.stateText = "Beware the break-dancing mighty deer!"; //break-dancing mighty deer because everytime it stops to rest it moves like crazy

rey.init = function() {
    this.body = this.sprite.body;  // Todo:  a way to automate this?
    rey.body.rotation = 100; // Initial Angle
    rey.body.speed = 100; // Initial Speed
    // Do something every n seconds.
    // game.time.events.loop(Phaser.Timer.SECOND * 1, rey.timedEvend, this);
}



rey.getStatus = function() {
    return rey.stateText;
}

rey.update = function() {
    if (Math.random() < .1) {
        //rey.angle += 100;
        rey.incrementAngle(100);
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            rey.body.speed = 300;
            rey.stateText = "Here comes the break-dancing mighty deer!";
        } else {
            rey.body.speed = 0;
            rey.stateText = "Time to bust a move! *begins break-dancing*";
        }
    }
rey.basicUpdate();
};

