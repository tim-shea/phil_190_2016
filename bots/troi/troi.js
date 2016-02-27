var troi = new Bot(0, 3000, 'troi', 'bots/troi/umbreon_2.0.png');

/**
 *@author Troi Chua
 *@date February 26,2016
 */


// (Override) Initialize Bot
troi.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed
    troi.stamina = 250000; // initial stamina

    troi.STAMINA_MAX = 20000,
        troi.STAMINA_MIN = 0;

    troi.I1 = 0.20; //random encounter with "antagonist"
    troi.I2 = 0.30; //Probability of "being alone"
    troi.I3 = 0.15; //Probability of finding food
    troi.I4 = 0.02; //Probability of finding treasure
    troi.I5 = 0.01; //Probabilty triggering a trap

    troi.rand = 0; //variable for random event if multiple can occur

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, troi.update1Sec, this); //main loop (1/sec) for status
    game.time.events.loop(Phaser.Timer.SECOND * .1, troi.updateTenthSec, this); //loops (10/sec) for updating the stamina
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, troi.update_1_30_sec, this); //loops every 2 minutes to update for hunger
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
            if (Math.random() <= .20) {
                if (Math.random() <= .10) { //Probability of being startled
                    if (Math.random() > .20) { //Probability of running away
                        return troi.sprinting;
                    } else { //Probably of freezing in fear
                        return troi.resting;
                    }
                } else { // Probability of choosing to transition states
                    if (Math.random() <= .50) { //Probability of choosing to sprint 
                        return troi.sprinting;
                    } else { //Probability of resting
                        return troi.resting;
                    }
                    return troi.walking;
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
        troi.stamina -= 10; //energy spent walking        
    }
}
troi.resting = {
    description: "Resting",
    transitionProbability: .30, //Probability of transition states
    transition: function() {
        if (troi.stamina > 200) {
            return troi.walking; //resume walking
        } else {
            return troi.resting;
        }
    },
    update: function() {
        // Standing still
        troi.body.speed = 0;
        troi.stamina += 20; //energy recharging while walking
    }
}
troi.sprinting = {
    description: "Sprinting",
    transition: function() {
        if (troi.stamina <= 100) {
            return troi.exhausted; //become exhauseted when stamina level is low
        } else {
            if (Math.random() < 0.15) {
                return troi.walking;
            } else {
                return troi.sprinting;
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
        troi.stamina -= 50; //consume more stamina sprinting
    }
}
troi.exhausted = { //penalty for not watching stamina
    description: "Exhausted",
    transition: function() {
        if (troi.stamina <= 0) {
            return troi.recovering;
        }
    },
    update: function() {
        // Slow
        troi.body.speed -= 5;
        troi.stamina -= 10; //catching breath and panting, so stamina still goes down
    }
}
troi.recovering = {
    description: "Recovering", //intermediate recovery stage before true resting state; cannot transit into any other state than rest
    transition: function() {
        if (troi.stamina >= 20) {
            return troi.resting;
        }
    },
    update: function() {
        troi.body.speed = 0;
        troi.stamina += 20;
    }
}

//// Emotion states


troi.euphoric = { //Really happy
    name: "Euphoric",
    transitionProbability: 0.45, //Probabilty of troi. event occuring
    transition: function() {
        if (Math.random() < troi.I5) { //trigger trap
            troi.rand = Math.random();
            if (troi.rand < .10) { //10% chance to stay euphoric
                return troi.euphoric;
            } else if (troi.rand < .25) { //15% chance to just become happy
                return troi.happy;
            } else if (troi.rand < .55) { //30% chance to become neutral
                return troi.neutral;
            } else if (troi.rand < .80) { //25% chance to become agitated
                return troi.agitated;
            } else { //20% chance to become angry
                return troi.angry;
            }

        } else if (Math.random() < troi.I4) { //find treasure
            return troi.euphoric;
        } else if (Math.random() < troi.I3) { //find food
            return troi.euphoric;
        } else if (Math.random() < troi.I2) { //isolation causes sadness
            troi.rand = Math.random();
            if (troi.rand < .75) { //mental state becomes less happy
                return troi.happy;
            } else {
                return troi.euphoric; //unaffected
            }
        } else if (Math.random() < troi.I1) { //random encounter
            troi.rand = Math.random(); //chance of I1
            if (troi.rand < .80) {
                return troi.happy;
            } else {
                return troi.euphoric;
            }
        } else {
            return troi.euphoric;
        }
    },
    getMotionMode: function() {
        //when euphoric sprint or walk if stamina is sufficient
        if (troi.stamina <= 20) {
            return troi.resting;
        } else if ((troi.motionMode != troi.resting || troi.motionMode != troi.exhausted) && troi.stamina <= 100) { //threshold that exhaustion cannot occur if resting or already exausted
            return troi.exhausted;
        } else {
            troi.rand = Math.random(); //motion transition
            if (troi.rand < .75) {
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
        if (Math.random() < troi.I1) { //random encouter
            if (Math.random() < .40) {
                return troi.neutral;
            } else {
                return troi.agitated;
            }
        } else if (Math.random() < troi.I2) { //isolation causes sadness
            if (Math.random() < .80) {
                return troi.neutral;
            } else {
                return troi.happy;
            }
        } else if (Math.random() < troi.I3) {
            if (Math.random() < .25) {
                return troi.euphoric;
            } else {
                return troi.happy;
            }
        } else if (Math.random() < troi.I4) {
            return troi.euphoric;
        } else {
            troi.rand = Math.random();
            if (troi.rand < .40) {
                return troi.agitated;
            } else if (troi.rand < .95) {
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
        } else if ((troi.motionMode != troi.resting || troi.motionMode != troi.exhausted) && troi.stamina <= 100) { //threshold that exhaustion cannot occur if resting or already exausted
            return troi.exhausted;
        } else {
            troi.rand = Math.random();
            if (troi.rand < .65) {
                return troi.walking;
            } else {
                return troi.sprinting;
            }
        }
    }
}

troi.neutral = {
    name: "Neutral",
    transitionProbability: .10,
    transition: function() {
        if (Math.random() < troi.I1) { //random encounter
            if (Math.random() < .60) {
                return troi.agitated;
            } else {
                return troi.neutral;
            }
        } else if (Math.random() < troi.I2) { //isolation causes sadness
            if (Math.random() < .20) {
                return troi.agitated;
            } else {
                return troi.neutral;
            }
        } else if (Math.random() < troi.I3) {
            if (Math.random() < .80) {
                return troi.happy;
            } else {
                return troi.neutral;
            }
        } else if (Math.random() < troi.I4) {
            if (Math.random() < .95) {
                return troi.euphoric;
            } else {
                return troi.happy;
            }
        } else {
            if (Math.random() < .95) {
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
        } else if ((troi.motionMode != troi.resting || troi.motionMode != troi.exhausted) && troi.stamina <= 100) { //threshold that exhaustion cannot occur if resting or already exausted
            return troi.exhausted;
        } else {
            troi.rand = Math.random();
            if (troi.rand < .20) {
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
        if (Math.random() < troi.I1) { //random encouter
            if (Math.random() < .80) {
                return troi.angry;
            } else {
                return troi.agitated;
            }
        } else if (Math.random() < troi.I2) {
            if (Math.random() < .80) {
                return troi.neutral;
            } else {
                return troi.agitated;
            }
        } else if (Math.random() < troi.I3) {
            return troi.neutral;
        } else if (Math.random() < troi.I4) {
            troi.rand = Math.random();
            if (troi.rand < .50) {
                return troi.neutral;
            } else if (troi.rand < .30) {
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
        } else if ((troi.motionMode != troi.resting || troi.motionMode != troi.exhausted) && troi.stamina <= 100) { //threshold that exhaustion cannot occur if resting or already exausted
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
        if (Math.random < troi.I2) {
            if (Math.random() < .20) {
                return troi.agitated;
            } else {
                return troi.angry;
            }
        } else if (Math.random() < troi.I3) {
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
        } else if ((troi.motionMode != troi.resting || troi.motionMode != troi.exhausted) && troi.stamina <= 100) { //threshold that exhaustion cannot occur if resting or already exausted
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


// Hunger 

troi.hunger = {
    amount: 0,
    eat: function(food_amount) {
        this.amount -= food_amount; //this. refers to specific class
        this.amount = Math.max(0, this.amount); // Don't allow hunger to go below 0

    },
    update: function() {
        if (this.amount >= 500) {
            // Do nothing.  Hunger is capped. 
        } else {
            this.amount += 10;
        }
    },
    toString: function() {
        var hungerLevel = ""; // initializer

        if (this.amount < 100) {
            hungerLevel = "Happy";
            troi.emotion = troi.happy; //well fed = happy Umbreon
            troi.stamina--;
        } else if (this.amount < 300) {
            hungerLevel = "Hungrwe";
            troi.emotion = troi.neutral;
            troi.stamina -= 2;
        } else if (this.amount < 400) {
            hungerLevel = "Huuuungrweeeeeeeee!!"; //hunger causes energy to decrease faster
            troi.stamina -= 3;
            troi.emotion = troi.agitated; //upset from hunger
        } else {
            hungerLevel = "FOOOOOOOOOOOOOOOOOD Pweeeeeaaaaseeeeee!";
            troi.stamina -= 5;
            troi.emotion = troi.neutral; //to hungry to be angry
        }
        return hungerLevel + " (Hunger = " + this.amount + ")";
    }
}

//Id state - entertainment/amusment

troi.amuse = {
    time: 500,
    play: function(play_time) {
        this.time += play_time; //increases playtime
        this.time = Math.min(this.time, 0);

    },
    update: function() {
        if (this.time <= 0) {
            troi.emotion = troi.agitated; //0 playtime = upset troi
        } else {
            this.time -= 5; //time spent playing
        }
    },
    toString: function() {
        var amuse_level = ""; //initializer

        if (this.time >= 250) {
            amuse_level = "WOOOOOOOOOOOOOT!";
            troi.emotion = troi.euphoric; //#// code currently stands as responsible for crashing
            troi.stamina -= 5; //playtime takes energy
        } else if (this.time >= 100) {
            amuse_level = "YAAAY!!!";
            troi.emotion = troi.happy;
            troi.stamina -= 3;
        } else if (this.time >= 50) {
            amuse_level = "...awe...";
            troi.emotion = troi.neutral;
            troi.stamina--;
        } else {
            amuse_level = "Sooooooooooooooooooooooooo Boooooooooooooooooooooooooooooooooored.";
            troi.emotion = troi.agitated; //Boredom is painful
        }
        return amuse_level + " (Amusement Level = " + this.time + ")";
    }
}


// Current States
troi.emotion = troi.neutral;
troi.motionMode = troi.walking;


// (Override) Populate status field
troi.getStatus = function() {
    var statusString = troi.emotion.name;
    statusString += "\n-------";
    statusString += "\nMotion mode: " + troi.motionMode.description + "\nEmotion mode: " + troi.emotion.name;
    statusString += "\nStamina : " + troi.stamina + "\n" + troi.hunger.toString() + "\n" + troi.amuse.toString();
    return statusString;
}

// (Override) Main update.  On my machine this is called about 43 times per second
troi.update = function() {
    if (troi.atBoundary() === true) {
        troi.incrementAngle(45);
    }
    if (troi.motionMode) {
        troi.motionMode.update(); // Todo: IncrementAngle does not work when called from timed functions.  Not sure why not.        
    }
    this.basicUpdate();
};

// Called every tenth of a second
//updates stamina
troi.updateTenthSec = function() {
    if (troi.stamina <= 0) {
        troi.motionMode = troi.resting;
        troi.stamina = troi.STAMINA_MIN;
    } else if (troi.motionMode != troi.resting && troi.stamina <= 400) {
        troi.motionMode = troi.exhausted;
    }
    if (troi.stamina >= troi.STAMINA_MAX) {
        troi.stamina = troi.STAMINA_MAX;
    }

}


// Called every second
//updates status
troi.update1Sec = function() {
    if (troi.emotion) {
        if (Math.random() < troi.emotion.transitionProbability) {
            troi.emotion = troi.emotion.transition();
        }
    }
    if (troi.emotion && troi.motionMode) {
        troi.motionMode = troi.emotion.getMotionMode();
    }
    //console.log(troi.motionMode.description);
    //console.log(troi.emotion.name);
    troi.amuse.update();
    troi.hunger.update();

}
troi.update_1_30_sec = function() {
    troi.hunger.eat(501); //food for troi
    troi.amuse.play(500); //playtime increment
    troi.stamina = troi.STAMINA_MAX;
}
