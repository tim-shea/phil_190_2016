var rey = new Bot(240, 220, 'rey', 'bots/rey/whitedeer.png');

// (Override) Initialize Bot
rey.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, rey.update1Sec, this);
    //game.time.events.loop(Phaser.Timer.SECOND * .01, rey.updateTenthSec, this);
}

//
// Motion modes
//
rey.walking = {
    description: "Walking",
    update: function() {
        // Slight tilting when moving
        if (Math.random() < .5) {
            rey.incrementAngle(10 * Math.random() - 5);

        }
        // A leisurely place
        rey.body.speed = 200;
        console.log("Someone join me!!!!");

    }
}
rey.still = {
    description: "Still",
    update: function() {
        // Stand still
        rey.body.speed = 0;
        console.log("Taking a break!");
    }
}
rey.dancing = {
    description: "Dancing",
    update: function() {
        // Wilder steering changes
        if (Math.random() < .5) {
            rey.incrementAngle(50 * Math.random() - 5);
        }
        // Fast
        rey.body.speed = 1000;
        console.log("Dun Dun Dun Dun");
    }
}


//
// Emotion states
//
rey.energized = {
    name: "energized",
    transitionProbability: .5,
    transition: function() {
        if (Math.random() < .4) {
            return rey.energized;
        } else {
            return rey.exhausted;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .33) {
            return rey.walking;
        } else {
            return rey.dancing;
        }
    }
}
rey.exhausted = {
    name: "exhausted",
    transitionProbability: .2,
    transition: function() {
        // Leave this state 80% of the time
        if (Math.random() < .7) {
            // If exiting, go to back to energized
            return rey.energized;
        } else {
            return rey.exhausted;
        }
    },
    getMotionMode: function() {
        return rey.still;
    }

}

// Current States
rey.emotion = rey.energized;
rey.motionMode = rey.walking;

// (Override) Populate status field motionMode.description
rey.getStatus = function() {
    var statusString = rey.motionMode.description;
    statusString += " because I am ";
    statusString += rey.emotion.name;
    statusString += ".";
    return statusString;
}

rey.update = function() {
    if (rey.atBoundary() === true) {
        rey.incrementAngle(45);
    }
    rey.motionMode.update(); // Todo: IncrementAngle does not work when called from timed functions.  Not sure why not.
    this.basicUpdate();
};

rey.update1Sec = function() {
    if (Math.random() < rey.emotion.transitionProbability) {
        rey.emotion = rey.emotion.transition();
    }
    rey.motionMode = rey.emotion.getMotionMode();
}
