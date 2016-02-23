var dylan = new Bot(240, 220, 'dylan', 'bots/dylan/player_car.png');


//getStats & init for later??
dylan.init = function() {
    this.body = this.sprite.body;
    this.body.rotation = 100;
    this.body.speed = 100;

    game.time.events.loop(Phaser.Timer.SECOND * 5, dylan.update5Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * .5, dylan.updateHalfSec, this);

}

dylan.cruising = {
    description: "cruising",
    update: function() {

        //slight increase of speed
        dylan.body.speed = 200;
    }
}

dylan.parked = {
    description: "parked",
    update: function() {
        
        dylan.body.speed = 0;
    }
}

dylan.speeding = {
    description: "speeding",
    update: function() {
        // Wilder steering changes
        if (Math.random() < .5) {
            dylan.incrementAngle(50 * Math.random() - 5);
        }
        // Fast
        dylan.body.speed = 575;
    }
}


dylan.calm = {
    name: "Calm",
    transitionProbability: .05,
    transition: function() {
        if (Math.random() < .8) {
            return dylan.angry;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .4) {
            return dylan.parked;
        }
    }
}

dylan.angry = {
    name: "Angry",
    transitionProbability: .2,
    transition: function() {
        // Leave this state 70% of the time
        if (Math.random() < .7) {
            // Go to back to calm
            return dylan.calm;
        } else {
            return dylan.angry;
        }
    },
    getMotionMode: function() {
        return dylan.speeding;
    }

}

dylan.emotion = dylan.calm;
dylan.motionMode = dylan.cruising;




dylan.getStatus = function() {
    var statusString = dylan.emotion.name;
    statusString += "/n-------";
    statusString += "/nMotion mode: " + dylan.motionMode.description;
    return statusString;
}

dylan.update = function() {

    if (dylan.atBoundary() === true) {
        dylan.incrementAngle(45);
    }

    dylan.motionMode.update();
    this.basicUpdate();

};



dylan.update5Sec = function() {
    if (Math.random() < dylan.emotion.transitionProbability) {
        dylan.emotion = dylan.emotion.transition();

    }
    dylan.motionMode = dylan.emotion.getMotionMode();
}
