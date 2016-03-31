var Daniel = new Bot(240, 220, 'Daniel', 'js/bots/Daniel/espeon.png');

Daniel.init = function() {
    this.body = this.sprite.body;
    this.body.angle = 100; // Initial Angle
    this.body.speed = 70; // Initial Speed
    //this.sprite.scale.setTo(3,3);
    // ^ this is how you scale things.  Use this for the shield.
    //Initialized timed events
    game.time.events.loop(Phaser.Timer.SECOND * 1, Daniel.updateOneSecond, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60, Daniel.updateMin, this);
}

Daniel.isEdible = function(object) {
    if (object.name == "jerry_can") {
        return false;
    } else {
        return object.isEdible;
    }
}

Daniel.utilityFunction = function(object) {
    if (object instanceof Bot) {
        return 30;
    } else if (object.name == "jerry_can") {
        return -90;
    } else if (object.name == "steak") {
        return -40;
    } else if (object.isEdible) {
        return object.calories;
    } else {
        return 0;
    }
}

//
// Fear State
//
Daniel.fear = {
    amount: 0,
    reassure: function(ease_amount) {
        this.amount -= ease_amount;
        this.amount = Math.max(-25, this.amount);
    },
    update: function() {
        if (this.amount >= 100) {
            //cry alot
        } else {
            this.amount++;
        }
    },
    toString: function() {
        var fearLevel = "Fear Level: ";
        if (this.amount < 0) {
            fearLevel += "No Fear/Maximum Overconfidence!";
        } else if (this.amount < 30) {
            fearLevel += "I'm not afraid!";
        } else if (this.amount < 50) {
            fearLevel += "Getting scared now...";
        } else if (this.amount < 70) {
            fearLevel += "Now I'm actually scared";
        } else if (this.amount < 90) {
            fearLevel += "Now I am TERRIFIED TIME TO GO HOME";
        }
        return fearLevel + " (Fear = " + this.amount + "%)";
    }
}


//
// Hunger State
//
Daniel.hunger = {
    amount: 0,
    eatIt: function(food_amount) {
        this.amount -= food_amount;
        this.amount = Math.max(0, this.amount);
    },
    update: function() {
        if (this.amount >= 100) {
            //do nothing
        } else if (Daniel.motionMode == Daniel.baseline) {
            this.amount += 1;;
        } else if (Daniel.motionMode == Daniel.powerwalking) {
            this.amount += 2;
        } else if (Daniel.motionMode == Daniel.sonic) {
            this.amount += 5;
        } else {
            this.amount += 0.5;
        }
    },
    toString: function() {
        var hungerLevel = "Hunger Level: ";
        if (this.amount < 20) {
            hungerLevel += "Not hungry";
        } else if (this.amount < 60) {
            hungerLevel += "Hungry";
        } else if (this.amount < 80) {
            hungerLevel += "Starving!!";
        } else {
            hungerLevel += "FEED ME!";
        }
        return hungerLevel + " (Hunger = " + this.amount + "%)";
    }
}

//
// Motion States
//
Daniel.baseline = {
    description: "Walking pace",
    update: function() {
        Daniel.body.speed = 70;
        if (Math.random() < .3) {
            Daniel.incrementAngle(Daniel.getRandom(-5, 5));
        }
    }
}
Daniel.powerwalking = {
    description: "A little faster now",
    update: function() {
        Daniel.body.speed = 100;
        if (Math.random() < .5) {
            Daniel.incrementAngle(Daniel.getRandom(-10, 10));
        }
    }
}
Daniel.sonic = {
    description: "GOTTA GO FAST GOTTA GO FAST GOTTA GO FAST",
    update: function() {
        Daniel.body.speed = 500;
    }
}
Daniel.exhaustion = {
    description: "I need to sit down now...",
    update: function() {
        Daniel.body.speed = 0;
        if (Math.random() < .2) {
            Daniel.incrementAngle(Daniel.getRandom(-3, 3));
        }
    }
}

//
// Mental States
//

Daniel.chill = {
    name: "calm.",
    transitionProb: .3,
    transition: function() {
        if (Math.random() < .4) {
            return Daniel.enthusiastic;
        } else {
            return Daniel.apathetic;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .9) {
            return Daniel.baseline;
        } else {
            return Daniel.exhaustion;
        }
    }
}
Daniel.enthusiastic = {
    name: "enthusiastic!",
    transitionProb: .4,
    transition: function() {
        if (Math.random() < .3) {
            return Daniel.chill;
        } else {
            return Daniel.enthusiastic
        }
    },
    getMotionMode: function() {
        if (Math.random() < .5) {
            return Daniel.powerwalking;
        } else {
            return Daniel.sonic;
        }
    }
}
Daniel.apathetic = {
    name: "bored.",
    transitionProb: .7,
    transition: function() {
        if (Math.random() < .7) {
            return Daniel.chill;
        } else {
            return Daniel.apathetic;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .8) {
            return Daniel.exhaustion;
        } else {
            return Daniel.baseline;
        }
    }
}

Daniel.emotion = Daniel.chill;
Daniel.motionMode = Daniel.baseline;

Daniel.getStatus = function() {
    var statusString = "I am feeling " + Daniel.emotion.name;
    statusString += "\n>------<";
    statusString += "\nSpeed: " + Daniel.motionMode.description;
    statusString += "\n" + Daniel.hunger.toString();
    statusString += "\n" + Daniel.fear.toString();
    return statusString;
}

Daniel.update = function() {
    Daniel.motionMode.update();
    Daniel.genericUpdate();
};

Daniel.updateOneSecond = function() {
    Daniel.updateNetwork();
    Daniel.hunger.update();
    Daniel.fear.update();
    if (Math.random() < Daniel.emotion.transitionProb) {
        Daniel.emotion = Daniel.emotion.transition();
    }
    Daniel.motionMode = Daniel.emotion.getMotionMode();
}

Daniel.updateMin = function() {
    Daniel.hunger.eatIt(75);
    Daniel.fear.reassure(100);
}

Daniel.collision = function(object) {
    Daniel.addMemory("Saw " + object.name);
    Daniel.moveAwayFrom(object);
    if (Daniel.isEdible(object)) {
        Daniel.eatObject(object);
    }
}

Daniel.eatObject = function(objectToEat) {
    objectToEat.eat();
    Daniel.hunger.eatIt(objectToEat.calories);
    Daniel.speak(objectToEat, "Delicious " + objectToEat.description + "!");
}
