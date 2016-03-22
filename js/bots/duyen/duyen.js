var duyen = new Bot(75, 1800, 'duyen', 'js/bots/duyen/duyen.png');
duyen.angle = 90;
duyen.speed = 100;

duyen.stateText = "just flowing around";
duyen.speechText = "";
duyen.currentlyPursuing = "Nothing";

duyen.init = function() {
this.body = this.sprite.body;
duyen.body.rotation = 50;
duyen.body.speed = 50;

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, duyen.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * .01, duyen.updateTenthSec, this);
  	game.time.events.loop(Phaser.Timer.SECOND * 60*2, duyen.update2min, this);
 	game.time.events.loop(Phaser.Timer.SECOND * 60*3, duyen.update3min, this);
}


// Hunger 
duyen.hunger = {
    amount: 0,
    eat: function(food_amount) {
        this.amount -= food_amount;
        this.amount = Math.max(0,this.amount); // Don't allow hunger to go below 0
    },
    update: function() {
        if(this.amount >= 100) {
            // Do nothing.  Hunger is capped. 
        } else {
            this.amount++;
        }
    },
    toString: function() {
        var hungerLevel = "";
        if (this.amount < 30) {
            hungerLevel = "Full";
        } else if (this.amount < 70) {            
            hungerLevel = "Hungry";
        } else if (this.amount < 85) {            
            hungerLevel = "Starving";
        } else {            
            hungerLevel = "Feed Me!";
        }
        return hungerLevel + " (Hunger = " + this.amount + ")";
    }
}

//Hygiene
duyen.hygiene = {
    amount: 0,
    clean: function(clean_amount) {
        this.amount -= clean_amount;
        this.amount = Math.max(0,this.amount); // There's a limit to being dirty
    },
    update: function() {
        if(this.amount >= 100) {
            // Do nothing.  hygiene is capped. 
        } else {
            this.amount++;
        }
    },
    toString: function() {
        var hygieneLevel = "";
        if (this.amount < 40) {
            hygieneLevel = "Clean";
        } else if (this.amount < 85) {            
            hygieneLevel = "Dirty";
        } else {            
            hygieneLevel = "Filthy";
        }
        return hygieneLevel + " (Dirtiness = " + this.amount + ")";
    }
}


//
// Motion modes
//
duyen.floating = {
    description: "floating",
    update: function() {
        // Slight tilting when moving
        if (Math.random() < .5) {
            duyen.incrementAngle(10 * Math.random() - 5);

        }
        // A leisurely place
        duyen.body.speed = 75;
    }
}
duyen.stop = {
    description: "resting",
    update: function() {
        // Stand stop
        duyen.body.speed = 0;
    }
}
duyen.flying = {
    description: "flying",
    update: function() {
        // Change angle rarely and just a bit
        if (Math.random() < .5) {
            duyen.incrementAngle(10 * Math.random() - 5);
        }
        // Slow
        duyen.body.speed = 250;
    }
}

//
// Emotion states
//
/*duyen.happy = {
    name: "happy",
    transitionProbability: .05,
    transition: function() {
        if (Math.random() < .8) {
            return duyen.happy;
        } else {
            return duyen.sad;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .8) {
            return duyen.floating;
        } else {
            return duyen.stop;
        }
    }
}
duyen.mad = {
    name: "mad",
    transitionProbability: .2,
    transition: function() {
        // Leave this state 80% of the time
        if (Math.random() < .8) {
            return duyen.happy;
        } else {
            return duyen.mad;
        }
    },
    getMotionMode: function() {
        return duyen.flying;
    }

}
duyen.sad = {
    name: "sad",
    transitionProbability: .3,
    transition: function() {
        if (Math.random() < .8) {
            return duyen.happy;
        } else {
            return duyen.mad;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .4) {
            return duyen.floating;
        } else {
            return duyen.flying;
        }
    }
}*/

duyen.emotions = new MarkovProcess("calm");
duyen.emotions.add("calm", [
    ["calm", "happy", "mad", "sad"],
    [.7, .2, .05, .05]
]);
duyen.emotions.add("happy", [
    ["happy", "calm"],
    [.7, .3]
]);
duyen.emotions.add("mad", [
    ["mad", "calm", "sad"],
    [.7, .1, .2]
]);
duyen.emotions.add("sad", [
    ["sad", "calm", "mad"],
    [.6, .2, .2]
]);



// Current States
duyen.emotion = duyen.happy;
duyen.motionMode = duyen.floating;

// (Override) Populate status field
duyen.getStatus = function() {
    var statusString = "Emotion: " + duyen.emotion.name;
    statusString += "\nMotion: " + duyen.motionMode.description;
    statusString += "\n " + duyen.hunger.toString();
    statusString += "\n " + duyen.hygiene.toString();
    statusString += "\nMoving to: " + duyen.currentlyPursuing;
    statusString += "\nSpeech: " + duyen.speechText;
    return statusString;
}

// (Override) Main update.  On my machine this is called about 43 times per second
duyen.update = function() {
    if (duyen.atBoundary() === true) {
        duyen.incrementAngle(25);
    }
    duyen.motionMode.update(); // Todo: IncrementAngle does not work when called from timed functions.  Not sure why not.
    this.basicUpdate();
    duyen.genericUpdate();
};

// Called every tenth of a second
duyen.updateTenthSec = function() {
    //  No implementation
}

// Called every second
duyen.update1Sec = function() {
duyen.hunger.update();
duyen.hygiene.update();
    if (Math.random() < duyen.emotion.transitionProbability) {
        duyen.emotion = duyen.emotion.transition();
    }
    duyen.motionMode = duyen.emotion.getMotionMode();
}


// Called every two minutes
duyen.update2min = function() {
duyen.hunger.eat(101);


// Called every three minutes
duyen.update3min = function() {
duyen.hygiene.clean(101);
}


duyen.collision = function(object) {
    // console.log("Object is edible: " + object.isEdible);
    if (!duyen.speechText.contains(object.name)) {
        duyen.speechText += "Hello " + object.name + ".";
    }
    duyen.speak(object, "Hello " + object.name);
    // duyen.flee(object);
    // duyen.pursue(object);
}



duyen.hear = function(botWhoSpokeToMe, whatTheySaid) {
    // 
    if (!duyen.speechText.contains("Oh you")) {
        duyen.speechText += " Oh you just said " + whatTheySaid + ".";
    }
}


duyen.highFive = function(botToHighFive) {
    if (botToHighFive instanceof Bot) {
        duyen.speak(botToHighFive, "Hey " + botToHighFive.description + "!");
        }
    }



duyen.highFived = function(botWhoHighFivedMe) {
    duyen.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
}


duyen.eatObject = function(objectToEat) {
    objectToEat.eat();
    duyen.hunger.subtract(objectToEat.calories);
    duyen.speak(objectToEat, "Yummy " + objectToEat.description + "!");
}



duyen.punch = function(botToPunch, damage) {
    if (botToAttack instanceof Bot) {
        if (game.physics.arcade.distanceBetween(this.sprite, botToAttack.sprite) < 50) {
            botToAttack.gotAttacked(this, damage);
        }
    }
};


duyen.gotPunched = function(botWhoPunchedMe, damage) {
    console.log("Ouch! " + botWhoAttackedMe.name + " punched me!");
}
};





/*findFood [high]([duyen.hungerLevel(70, 100), !duyen.perceiveDanger()] -> [duyen.findFood()])
eatingProduction [high]([duyen.hungerLevel(70, 100), !duyen.perceiveDanger()] -> [duyen.eat()])
cleaningProduction [medium]([duyen.hygieneLevel(85,100), !duyen.perceiveDanger] -> [duyen.clean()])
restingState [high]([duyen.energyLevel(10, 100), !duyen.perceiveDanger()] -> [duyen.rest()])
flyingProduction [high]([duyen.energyLevel(100, 100), duyen.perceiveDanger(), duyen.hungerLevel(70, 100)] -> [duyen.fly()])
attackEnemy [medium]([duyen.energyLevel(70, 100), duyen.madLevel(80, 100), duyen.hungerLevel(80, 100), duyen.perceiveDanger()] -> [duyen.attack()])
fleeAway [high]([duyen.energyLevel(10,100), duyen.sadLevel(80,100), duyen.perceiveDanger()] -> [duyen.flee()])
pursueMate [low]([duyen.energyLevel(40, 100), duyen.sadLevel(90, 100), !duyen.perceiveDanger()] -> [duyen.pursue()])
avoidDanger [high]([duyen.perceiveDanger(), duyen.energyLevel(40, 100)] -> [duyen.avoid()])
dancingProduction [low]([duyen.happyLevel(80, 100), duyen.hungerLevel(30, 100), duyen.energyLevel(70, 100), !duyen.perceiveDanger] -> [duyen.dance()]
*/