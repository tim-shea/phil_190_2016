var Daniel = new Bot(240, 220, 'Daniel', 'js/bots/Daniel/espeon.png');
Daniel.currentMotion = Motions.walking;

Daniel.init = function() {
    this.body = this.sprite.body;
    this.body.angle = 100; // Initial Angle
    this.body.speed = 0; // Initial Speed
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
        // working on this atm
        // } else if (Daniel.currentMotion == motion.stop) {
        //     this.amount += 1;
        // } else if (Daniel.currentMotion == motion.still) {
        //     this.amount += 1;
        // } else if (Daniel.currentMotion == motion.walking) {
        //     this.amount += 2;
        // } else if (Daniel.currentMotion == motion.running) {
        //     this.amount += 3;
        // } else if (Daniel.currentMotion == motion.sonicSpeed) {
        //     this.amount += 5;
        // } else if (Daniel.currentMotion == motion.moping) {
        //     this.amount += 1.5;
        // } else if (Daniel.currentMotion == motion.tantrum) {
        //     this.amount += 5;
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
// Mental States
//

Daniel.emotion = new MarkovProcess("Chill");
Daniel.emotion.add("Chill", [
    ["Chill", "Enthusiastic", "Apathetic", "Irate"],
    [.8, .1, .05, .05]
]);
Daniel.emotion.add("Enthusiastic", [
    ["Chill", "Enthusiastic", "Apathetic", "Irate"],
    [.3, .5, .1, .1]
]);
Daniel.emotion.add("Apathetic", [
    ["Chill", "Enthusiastic", "Apathetic", "Irate"],
    [.2, .05, .6, .15]
]);
Daniel.emotion.add("Irate", [
    ["Chill", "Enthusiastic", "Apathetic", "Irate"],
    [.1, .25, .25, .4]
]);

Daniel.setMotion = function() {
    if (Daniel.emotion.current === "Chill") {
        if (Math.random < .5) {
            Daniel.currentMotion = Motions.still;
        } else {
            Daniel.currentMotion = Motions.walking;
        }
    } else if (Daniel.emotion.current === "Enthusiastic") {
        if (Math.random < .95) {
            Daniel.currentMotion = Motions.running;
        } else {
            Daniel.currentMotion = Motions.sonicSpeed;
        }
    } else if (Daniel.emotion.current === "Apathetic") {
        if (Math.random < .6) {
            Daniel.currentMotion = Motions.moping;
        } else {
            Daniel.currentMotion = Motions.stop;
        }
    } else if (Daniel.emotion.current === "Irate") {
        if (Math.random < .7) {
            Daniel.currentMotion = Motions.running;
        } else {
            Daniel.currentMotion = Motions.tantrum;
        }
    }
}

Daniel.getStatus = function() {
    var statusString = "I am feeling " + Daniel.emotion.current;
    statusString += "\n>------<";
    statusString += "\nSpeed: " + Daniel.currentMotion.description;
    statusString += "\n" + Daniel.hunger.toString();
    statusString += "\n" + Daniel.fear.toString();
    return statusString;
}

Daniel.update = function() {
    this.currentMotion.apply(Daniel);
    Daniel.genericUpdate();
};

Daniel.updateOneSecond = function() {
    Daniel.updateNetwork();
    Daniel.hunger.update();
    Daniel.fear.update();
    Daniel.emotion.update();
    Daniel.setMotion();
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
