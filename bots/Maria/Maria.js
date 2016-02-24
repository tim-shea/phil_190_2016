var maria = new Bot(240, 220, 'maria', 'bots/Maria/Maria.png');

maria.stateText = "The princess is here!";

maria.init = function() {
    maria.body = maria.sprite.body;
    maria.body.rotation = 100;
    maria.body.speed = 100;

    //Initialized time updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, maria.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * .01, maria.updateTenthSec, this);
}

//Motion modes
maria.dancing = {
    description: "dancing",
    update: function() {
        if (Math.random() < .5) {
            maria.incrementAngle(10 * Math.random() - 5);
        }
        maria.body.speed = 1000;
    }
}
maria.stop = {
    description: "stop",
    update: function() {
        maria.body.speed = 0;
    }
}
maria.skipping = {
    description: "skip",
    update: function() {
        if (Math.random() < .5) {
            maria.incrementAngle(50 * Math.random() - 5);
        }
        maria.body.speed = 2000;
    }
}

maria.sleep = {
    description: "sleep",
    update: function() {
        maria.body.speed = 0;
    }
}

//Emotion states

maria.happy = {
    name: "Happy",
    transitionProbability: .03,
    transition: function() {
        if (Math.random() < .3) {
            return maria.hyper;
        } else {
            return maria.sleepy;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .7) {
            return maria.stop;
        } else {
            return maria.dancing;
        }
    }
}
maria.hyper = {
    name: "Hyper",
    transitionProbability: .5,
    transition: function() {
        if (Math.random() < .5) {
            return maria.happy;
        } else {
            return maria.sleepy;
        }
    },
    getMotionMode: function() {
        return maria.skipping;
    }
}
maria.sleepy = {
        name: "Sleepy",
        transitionProbability: .3,
        transition: function() {
            if (Math.random() < .6) {
                return maria.sleepy;
            } else {
                return maria.hyper;
            }
        },
        getMotionMode: function() {
            return maria.sleep;
        }
    }

//Current States
maria.emotion = maria.happy;
maria.motionMode = maria.dancing;

//(Override) Populate status field
maria.getStatus = function() {
    var statusString = maria.emotion.name;
    statusString += "\n-------";
    statusString += "\nMotion mode: " + maria.motionMode.description;
    return statusString;
}

//(Override) Main Update.
maria.update = function() {
    if (maria.atBoundary() === true) {
        maria.incrementAngle(45);
    }
    maria.motionMode.update();
    this.basicUpdate();
};

//Called every tenth of a second
maria.updateTenthSec = function() {
    //  No implementation
}

// Called every second
maria.update1Sec = function() {
    if (maria.emotion) {
        if (Math.random() < maria.emotion.transitionProbability) {
            maria.emotion = maria.emotion.transition();

        }
        maria.motionMode = maria.emotion.getMotionMode();            
    }

}
