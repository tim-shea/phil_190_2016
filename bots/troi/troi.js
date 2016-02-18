var troi = new Bot(540, 520, 'troi', 'bots/troi/umbreon_2.0.png');



// (Override) Initialize Bot
troi.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed
    troi.stamina = 100; // initial stamina

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, troi.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * .01, troi.updateTenthSec, this);
}

//
// Motion modes
//
troi.walking = {
    description: "walking",
    transitionProbability: .20,
    transition: function() {
        if (Math.random  <= .15) {  //Probability of being startled
            if(Math.random > .20){    //Probability of running away
                return troi.sprinting;
            }else{
                return troi.resting;
            }
        }
    },
    update: function() {
        // Slight tilting when moving
        if (Math.random() < .5) {
            troi.incrementAngle(10 * Math.random() - 5);

        }
        // A leisurely place
        troi.body.speed = 200;
        troi.stamina--;
    }
}
troi.resting = {
    description: "at rest",
    update: function() {
        // Stand still
        troi.body.speed = 0;
        troi.stamina += 5;
    }
}
troi.sprinting = {
    description: "sprinting",
    update: function() {
        // Wilder steering changes
        if (Math.random() < .5) {
            troi.incrementAngle(50 * Math.random() - 5);
        }
        // Fast
        troi.body.speed = 500;
    }
}
troi.moping = {
    description: "moping",
    update: function() {
        // Change angle rarely and just a bit
        if (Math.random() < .05) {
            troi.incrementAngle(10 * Math.random() - 5);
        }
        // Slow
        troi.body.speed = 50;
    }
}

//
// Emotion states
//
troi.calm = {
    name: "Calm",
    transitionProbability: .05,
    transition: function() {
        if (Math.random() < .8) {
            return troi.happy;
        } else {
            return troi.angry;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .4) {
            return troi.resting;
        } else {
            return troi.moping;
        }
    }
}
troi.angry = {
    name: "Angry",
    transitionProbability: .2,
    transition: function() {
        // Leave this state 80% of the time
        if (Math.random() < .8) {
            // If exiting, go to back to calm
            return troi.calm;
        } else {
            return troi.angry;
        }
    },
    getMotionMode: function() {
        return troi.sprinting;
    }

}
troi.happy = {
    name: "Happy",
    transitionProbability: .01,
    transition: function() {
        if (Math.random() < .8) {
            return troi.calm;
        } else {
            return troi.angry;
        }
    },
    getMotionMode: function() {
        // When happy, either walk or spaz
        if (Math.random() < .8) {
            return troi.walking;
        } else {
            return troi.sprinting;
        }
    }
}
troi.sad = {
    name: "Sad",
    transitionProbability: .3,
    transition: function() {
        if (Math.random() < .8) {
            return troi.calm;
        } else {
            return troi.angry;
        }
    },
    getMotionMode: function() {
        return troi.moping;
    }
}

// Current States
troi.emotion = troi.calm;
troi.motionMode = troi.walking;


// (Override) Populate status field
troi.getStatus = function() {
    var statusString = troi.emotion.name;
    statusString += "\n-------";
    statusString += "\nMotion mode: " + troi.motionMode.description;
    return statusString;
}

// (Override) Main update.  On my machine this is called about 43 times per second
troi.update = function() {
    if (troi.atBoundary() === true) {
        troi.incrementAngle(45);
    }
    troi.motionMode.update(); // Todo: IncrementAngle does not work when called from timed functions.  Not sure why not.
    this.basicUpdate();
};

// Called every tenth of a second
troi.updateTenthSec = function() {
    console.log("ten");

}

troi.update1Sec = function() {
    console.log("one");
}

// Called every second
troi.update1Sec = function() {
    if (Math.random() < troi.emotion.transitionProbability) {
        troi.emotion = troi.emotion.transition();
    }
    troi.motionMode = troi.emotion.getMotionMode();
}
