var troi = new Bot(0, 3000, 'troi', 'js/bots/troi/umbreon_2.0.png');

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

    this.attackList = ("Shadow Ball", "Dark Pulse", "Payback", "Toxic", "Moonlight", "Agility");
    /*
        troi.I1 = 0.20; //random encounter with "antagonist"
        troi.I2 = 0.30; //Probability of "being alone"
        troi.I3 = 0.15; //Probability of finding food
        troi.I4 = 0.02; //Probability of finding treasure
        troi.I5 = 0.01; //Probabilty triggering a trap
        */

    troi.rand = 0; //variable for random event if multiple can occur

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 10, troi.update10Sec, this); //main loop (1/sec) for status
    game.time.events.loop(Phaser.Timer.SECOND * .1, troi.updateTenthSec, this); //loops (10/sec) for updating the stamina
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, troi.update_1_30_sec, this); //loops every 2 minutes to update for hunger
}
troi.motionMode = Motions.walking;



///////////////////
// Emotion Modes //
///////////////////
troi.emotion = new MarkovProcess("neutral");
troi.emotion.add("neutral", [
    ["neutral", "angry", "agitated", "happy", "euphoric"],
    [0.75, 0.025, 0.10, 0.10, 0.025]
]);
troi.emotion.add("happy", [
    ["euphoric", "happy", "neutral"],
    [0.65, 0.30, 0.05]
]);
troi.emotion.add("agitated", [
    ["agitated", "neutral", "angry"],
    [0.65, 0.25, 0.10]
]);
troi.emotion.add("euphoric", [
    ["euphoric", "happy", "neutral"],
    [0.55, 0.30, 0.15]
]);
troi.emotion.add("angry", [
    ["angry", "agitated", "neutral"],
    [0.35, 0.45, 0.20]
]);
//////////////////
// Motion modes //
//////////////////

troi.setMotion = function() {
    if (troi.motionMode.current === Motions.walking) {
        troi.stamina -= 10;
        if (troi.stamina <= 100) { //Pass stamina threshold
            return troi.exhausted;
        } else {
            if (Math.random() <= .20) {
                if (Math.random() <= .10) { //Probability of being startled
                    if (Math.random() > .20) { //Probability of running away
                        console.log('Run, Run Away!');
                        return Motions.running;
                    } else { //Probably of freezing in fear
                        return troi.resting;
                    }
                } else { // Probability of choosing to transition states
                    if (Math.random() <= .50) { //Probability of choosing to sprint 
                        return Motions.running;
                    } else { //Probability of resting
                        return troi.resting;
                    }
                    return Motions.walking;
                }

            }

        }
    }

    if (troi.motionMode.current === Motions.running) {
        troi.stamina -= 50;
        if (troi.stamina <= 100) {
            return troi.exhausted; //become exhauseted when stamina level is low
        } else {
            if (Math.random() < 0.15) {
                return Motions.walking;
            } else {
                return Motions.running;
            }
        }

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
            //troi.emotion = troi.happy; //well fed = happy Umbreon
            troi.stamina--;
        } else if (this.amount < 300) {
            hungerLevel = "Hungrwe";
            //troi.emotion = troi.neutral;
            troi.stamina -= 2;
        } else if (this.amount < 400) {
            hungerLevel = "Huuuungrweeeeeeeee!!"; //hunger causes energy to decrease faster
            troi.stamina -= 3;
            //troi.emotion = troi.agitated; //upset from hunger
        } else {
            hungerLevel = "FOOOOOOOOOOOOOOOOOD Pweeeeeaaaaseeeeee!";
            troi.stamina -= 5;
            //troi.emotion = troi.neutral; //to hungry to be angry
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
            //troi.emotion = troi.euphoric; //#// code currently stands as responsible for crashing
            troi.stamina -= 5; //playtime takes energy
        } else if (this.time >= 100) {
            amuse_level = "YAAAY!!!";
            //troi.emotion = troi.happy;
            troi.stamina -= 3;
        } else if (this.time >= 50) {
            amuse_level = "...awe...";
            //troi.emotion = troi.neutral;
            troi.stamina--;
        } else {
            amuse_level = "Sooooooooooooooooooooooooo Boooooooooooooooooooooooooooooooooored.";
            //troi.emotion = troi.agitated; //Boredom is painful
        }
        return amuse_level + " (Amusement Level = " + this.time + ")";
    }
}


// Current States
//troi.emotion = troi.neutral;



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
    /*if (troi.motionMode) {
        troi.motionMode.update(); // Todo: IncrementAngle does not work when called from timed functions.  Not sure why not.        
    }
    */
    this.basicUpdate();


    troi.genericUpdate();
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
troi.update10Sec = function() {
    /*if (troi.emotion) {
         if (Math.random() < troi.emotion.transitionProbability) {
             troi.emotion = troi.emotion.transition();
         }
     }
     if (troi.emotion && troi.motionMode) {
         troi.motionMode = troi.emotion.getMotionMode();
     }
     //console.log(troi.motionMode.description);
     //console.log(troi.emotion.name);
     */

    troi.setMotion();
    troi.amuse.update();
    troi.hunger.update();

}
troi.update_1_30_sec = function() {
    troi.hunger.eat(501); //food for troi
    troi.amuse.play(500); //playtime increment
    troi.stamina = troi.STAMINA_MAX;
}

/**
 * collisions
 * 
 * @param  {entity} object [may be food, may not be]
 */
troi.collision = function(object) {
    // console.log("Object is edible: " + object.isEdible);
    if (object.isEdible) {
        if (troi.hunger > 100) {
            troi.eatObject(object);
        }
    } else {
        troi.speak(object, "Hello " + object.name);
    }
}

/**
 * eatObject
 * @param  {[entity]} objectToEat [food]
 *
 */
troi.eatObject = function(objectToEat) {
    objectToEat.eat();
    //troi.hunger.subtract(objectToEat.calories);
    troi.hunger.eat(objectToEat.calories);
    troi.speak(objectToEat, "Yay, food. " + objectToEat.description + "!");
}

troi.hear = function(botWhoSpokeToMe, whatTheySaid) {
    troi.speak(botWhoSpokeToMe, "...Sure " + botWhoSpokeToMe.name); // TODO: Make more intelligent responses!
}

troi.highFive = function(botToHighFive) {
    if (botToHighFive instanceof Bot) {
        if (game.physics.arcade.distanceBetween(this.sprite, botToHighFive.sprite) < 100) {
            botToHighFive.highFived(this);
        }
    }
}

troi.highFived = function(botWhoHighFivedMe) {
    troi.speak(botWhoHighFivedMe, "Yo, wasuuuup? " + botWhoHighFivedMe.name + ".");
}

troi.ignore = function(annoyingBot) {
    this.incrementAngle(180);
    this.body.speed = 250;
    console.log(this.name + " ignored " + annoyingBot);
}
