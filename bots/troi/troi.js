var troi = new Bot(540, 520, 'troi', 'bots/troi/umbreon_2.0.png');
var STAMINA_MAX = 1500,
    STAMINA_MIN = 0;


// (Override) Initialize Bot
troi.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed
    troi.stamina = 1000; // initial stamina

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, troi.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * .01, troi.updateTenthSec, this);
}

//
// Motion modes
//
troi.walking = {
    description: "Walking",
    transition: function() {
        if (troi.stamina <= 100) { //Pass stamina threshold
            return troi.exhausted;
        } else {
            if (Math.random <= .20) {
                if (Math.random <= .10) { //Probability of being startled
                    if (Math.random > .20) { //Probability of running away
                        return troi.sprinting;
                    } else { //Probably of freezing in fear
                        return troi.resting;
                    }
                } else { // Probability of choosing to transition states
                    if (Math.random <= .50) { //Probability of choosing to sprint 
                        return troi.sprinting;
                    } else { //Probability of resting
                        return troi.resting;
                    }
                }
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
        if (troi.stamina > STAMINA_MIN) {
            troi.stamina -= 10; //energy spent walking
        }
    }
}
troi.resting = {
    description: "Resting",
    transitionProbability: .30, //Probability of transition states
    transition: function() {
        if (troi.stamina > 20) {
            return troi.walking; //resume walking
        }
    },
    update: function() {
        // Standing still
        troi.body.speed = 0;
        if (troi.stamina < STAMINA_MAX) {
            troi.stamina += 5; //energy recharging while walking
        } else {
            troi.stamina = STAMINA_MAX;
        }
    }
}
troi.sprinting = {
    description: "Sprinting",
    transition: function() {
        if (troi.stamina <= 100) {
            return troi.exhausted;
        } else {
            if (Math.random() < 0.15) {
                return troi.walking;
            }
        }
    },
    update: function() {
        // Wilder steering changes
        if (Math.random() < .5) {
            troi.incrementAngle(50 * Math.random() - 5);
        }
        // Fast
        troi.body.speed = 500;
        if (troi.stamina > STAMINA_MIN) {
            troi.stamina -= 50;
        } else {
            troi.stamina = STAMINA_MIN;

        }
    }
}
troi.exhausted = {
    description: "Exhausted",
    transition: function() {
        if (troi.stamina <= 0) {
            return troi.recovering;
        }
    },
    update: function() {
        // Slow
        troi.body.speed -= 5;
        if (troi.stamina > STAMINA_MIN) {
            troi.stamina -= 10;
        } else {
            troi.stamina = STAMINA_MIN;
        }
    }
}
troi.recovering = {
    description: "Recovering",
    transition: function() {
        if (troi.stamina >= 20) {
            return troi.resting;
        }
    },
    update: function() {
        troi.body.speed = 0;
        if (troi.stamina < STAMINA_MAX) {
            troi.stamina += 20;
        } else {
            troi.stamina = STAMINA_MAX;
        }
    }
}

//// Emotion states

// events
var I1 = 0.20; //random encounter with "antagonist"
var I2 = 0.30; //Probability of "being alone"
var I3 = 0.15; //Probability of finding food
var I4 = 0.02; //Probability of finding treasure
var I5 = 0.01; //Probabilty triggering a trap
var rand = 0; //variable for random event if multiple can occur

troi.euphoric = {
    name: "Euphoric",
    transitionProbability: 0.45, //Probabilty of event occuring
    transition: function() {
        if (Math.random() < I5) {
            rand = Math.random();
            if (rand < .10) { //10% chance to stay euphoric
                return troi.euphoric;
            } else if (rand < .25) { //15% chance to just become happy
                return troi.happy;
            } else if (rand < .55) { //30% chance to become neutral
                return troi.neutral;
            } else if (rand < .80) { //25% chance to become agitated
                return troi.agitated;
            } else { //20% chance to become angry
                return troi.angry;
            }

        } else if (Math.random() < I4) {
            return troi.euphoric;
        } else if (Math.random < I3) {
            return troi.euphoric;
        } else if (Math.random() < I2) {
            rand = Math.random;
            if (rand < .75) {
                return troi.happy;
            } else {
                return troi.euphoric;
            }
        } else { //random encounter
            rand = Math.random();
            if (rand < .80) {
                return troi.happy;
            } else {
                return troi.euphoric;
            }
        }
    },
    getMotionMode: function() {
        //when euphoric sprint or walk if stamina is sufficient
        if (troi.stamina <= 0) {
            return troi.resting;
        } else if (troi.stamina <= 100) {
            return troi.exhausted;
        } else {
            rand = Math.random();
            if (rand < .75) {
                return troi.sprinting;
            } else {
                return troi.walking;
            }
        }
    }
}

troi.happy = {
    name: "Happy",
    transitionProbability: .25,
    transition: function() {
        if (Math.random() < I1) {
            if (Math.random < .40) {
                return troi.neutral;
            } else {
                return troi.walking;
            }
        } else if (Math.random < I2) {
            if (Math.random < .80) {
                return troi.neutral;
            } else {
                return troi.happy;
            }
        } else if (Math.random() < I3) {
            if (Math.random < .75) {
                return troi.happy;
            }
        } else if (Math.random < I4) {
            return troi.euphoric;
        } else {
            rand = Math.random();
            if (rand < .40) {
                return troi.agitated;
            } else if (rand < .95) {
                return troi.angry;
            } else {
                return troi.neutral;
            }
        }
    },
    getMotionMode: function() {
        // When happy, either walk or sprint if stamina is sufficient
        if (troi.stamina <= 0) {
            return troi.resting;
        } else if (troi.stamina <= 100) {
            return troi.exhausted;
        } else {
            rand = Math.random();
            if (rand < .65) {
                return troi.walking;
            } else {
                return troi.sprintin;
            }
        }
    }
}

troi.neutral = {
    name: "Neutral",
    transitionProbability: .10,
    transition: function() {
        if (Math.random() < I1) {
            if (Math.random() < .60) {
                return troi.agitated;
            }
        } else if (Math.random < I2) {
            if (Math.random() < .20) {
                return troi.agitated;
            }
        } else if (Math.random < I3) {
            if (Math.random < .80) {
                return troi.happy;
            }
        } else if (Math.random < I4) {
            if (Math.random() < .95) {
                return troi.euphoric;
            } else {
                return troi.happy;
            }
        } else {
            if (Math.random < .95) {
                return troi.angry;
            } else {
                return troi.agitated;
            }
        }

    },
    getMotionMode: function() {
        // When neutral, either walk or sprint if stamina is sufficient
        if (troi.stamina <= 0) {
            return troi.resting;
        } else if (troi.stamina <= 100) {
            return troi.exhausted;
        } else {
            rand = Math.random();
            if (rand < .20) {
                return troi.sprinting;
            } else {
                return troi.walking;
            }
        }
    }
}
troi.agitated = {
    name: "Agitated",
    transitionProbability: .25,
    transition: function() {
        if (Math.random() < I1) {
            if (Math.random() < .80) {
                return troi.angry;
            }
        } else if (Math.random < I2) {
            if (Math.random() < .80) {
                return troi.neutral;
            }
        } else if (Math.random < I3) {
            return troi.neutral;
        } else if (Math.random < I4) {
            rand = Math.random();
            if (rand < .50) {
                return troi.neutral;
            } else if (rand < .30) {
                return troi.happy;
            } else {
                return troi.euphoric;
            }
        } else {
            return troi.angry;
        }
    },
    getMotionMode: function() {
        // When agitated, walk if stamina is sufficient
        if (troi.stamina <= 0) {
            return troi.resting;
        } else if (troi.stamina <= 100) {
            return troi.exhausted;
        } else {
            return troi.walking;

        }
    }
}

troi.angry = {
    name: "Angry",
    transitionProbability: .25,
    transition: function() {
        if (Math.random < I2) {
            if (Math.random() < .20) {
                return troi.agitated;
            }
        } else if (Math.random < I3) {
            return troi.agitated;
        } else {
            rand = Math.random();
            if (rand < .70) {
                return troi.neutral;
            } else if (rand < .90) {
                return troi.happy;
            } else {
                return troi.euphoric;
            }
        }
    },
    getMotionMode: function() {
        // When angry, either walk or rest if stamina is sufficient
        if (troi.stamina <= 0) {
            return troi.resting;
        } else if (troi.stamina <= 100) {
            return troi.exhausted;
        } else {
            rand = Math.random();
            if (rand < .60) {
                return troi.walking;
            } else {
                return troi.resting;
            }
        }
    }

}



// Current States
troi.emotion = troi.neutral;
troi.motionMode = troi.walking;


// (Override) Populate status field
troi.getStatus = function() {
    var statusString = troi.emotion.name;
    statusString += "\n-------";
    statusString += "\nMotion mode: " + troi.motionMode.description + "\nEmotion mode: " + troi.emotion.description;
    statusString += "\nStamina : " + troi.stamina;
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

}


// Called every second
troi.update1Sec = function() {
    if (Math.random() < troi.emotion.transitionProbability) {
        troi.emotion = troi.emotion.transition();
    }
    troi.motionMode = troi.emotion.getMotionMode();
}