var Daniel = new Bot(240, 220, 'Daniel', 'js/bots/Daniel/espeon.png');

Daniel.init = function() {
    this.body = this.sprite.body;
    this.body.angle = 100; // Initial Angle
    this.body.speed = -70; // Initial Speed

    //Initialized timed events
    game.time.events.loop(Phaser.Timer.SECOND * 1, Daniel.updateOneSecond, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60, Daniel.updateMin, this);
}

/**
 * Fear State
 */
Daniel.fear = {
    amount: 0,
    reassure: function(ease_amount) {
        this.amount -= ease_amount;
        this.amount = Math.max(-25, this.amount);
    },
    update: function() {
        if (this.amount >= 100) {
            /**
             * cry alot
             */
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

/**
 * Hunger State
 */
Daniel.hunger = {
    amount: 0,
    eat: function(food_amount) {
        this.amount -= food_amount;
        this.amount = Math.max(0, this.amount);
    },
    update: function() {
        if (this.amount >= 100) {
            /**
             * do nothing
             */
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
/**
 * Motion States
 */

Daniel.baseline = {
    description: "Walking pace",
    update: function() {
        Daniel.body.speed = -70;
        if (Math.random() < .3) {
            Daniel.incrementAngle(Daniel.getRandom(-5, 5));
        }
    }
}
Daniel.powerwalking = {
    description: "A little faster now",
    update: function() {
        Daniel.body.speed = -100;
        if (Math.random() < .5) {
            Daniel.incrementAngle(Daniel.getRandom(-10, 10));
        }
    }
}
Daniel.sonic = {
    description: "GOTTA GO FAST GOTTA GO FAST GOTTA GO FAST",
    update: function() {
        Daniel.body.speed = -500;
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
/**
 * Mental States
 */

Daniel.emotions = new MarkovProcess("Chill");
Daniel.emotions.add("Chill", [
    ["Chill", "Enthusiastic", "Apathetic"],
    [.8, .1, .1]
]);
Daniel.emotions.add("Apathetic", [
    ["Enthusiastic", "Chill", "Apathetic"],
    [.05, .45, .5]
]);
Daniel.emotions.add("Enthusiastic", [
    ["Apathetic", "Chill", "Enthusistic"],
    [.05, .45, .5]
]);

Daniel.motionMode = Daniel.baseline;

Daniel.getStatus = function() {
    var statusString = "I am feeling " + Daniel.emotions.current;
    statusString += "\n>------<";
    statusString += "\nSpeed: " + Daniel.motionMode.description;
    statusString += "\n" + Daniel.hunger.toString();
    statusString += "\n" + Daniel.fear.toString();
    return statusString;
}

Daniel.collision = function(object) {
    if (object.isEdible) {
        Daniel.eatObject(object);
    } else {
        Daniel.speak(object, "Hello " + object.name);
    }
    if (object instanceof Bot) {
        object.highFive();
    }
    if (object instanceof Bot && Daniel.fear.amount > 75) {
        console.log("Shielding against " + object);
        Daniel.shield(object);
    }
}

Daniel.eatObject = function(edibleObject) {
    edibleObject.eat();
    Daniel.hunger.eat(edibleObject.calories);
    Daniel.speak(edibleObject, "Yummy " + edibleObject.description + "!");
}

Daniel.hear = function(botWhoSpokeToMe, whatTheySaid) {
    //console.log("Heard");
    Daniel.speak(botWhoSpokeToMe, "I hear ya, " + botWhoSpokeToMe.name); 
}
 
Daniel.highFived = function(botWhoHighFivedMe) {
    //console.log("High Fived");
    Daniel.speak(botWhoHighFivedMe, "High five, " + botWhoHighFivedMe.name + "!");
}

Daniel.update = function() {
    Daniel.motionMode.update(); // Todo: IncrementAngle does not work when called from timed functions.  Not sure why not.
    this.basicUpdate();
    Daniel.genericUpdate();
};

Daniel.updateOneSecond = function() {
    Daniel.hunger.update();
    Daniel.fear.update();
}
/*
Feeds every minute
 */
Daniel.updateMin = function() {
    Daniel.fear.reassure(100);
}