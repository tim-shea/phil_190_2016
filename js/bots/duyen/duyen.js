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
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, duyen.update2min, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 3, duyen.update3min, this);

    // Make productions
    this.makeProductions();
}

// Creating productions

duyen.makeProductions = function() {
    eatingProduction = new Production("eating",
        Production.priority.High,
        function() {
            return (
                duyen.hunger.value > 70 &&
                duyen.emotions.current === "mad");
        },
        function() {
            duyen.currentMotion = Motions.tanturm;
            duyen.extraText = "I'm hungry!";
        });
    cleaningProduction = new Production("cleaning",
        Production.priority.Medium,
        function() {
            return (
                duyen.hygiene.value > 30 &&
                duyen.emotions.current === "sad");
        },
        function() {
            duyen.extraText = "I feel yucky";
        });
    attackEnemy = new Production("attack",
        Production.priority.Medium,
        function() {
            return (
                duyen.hunger.value > 70 &&
                duyen.emotions.current === "mad" &&
                duyen.hunger.value > 20);
        },
        function() {
            duyen.currentMotion = Motions.attack;
            duyen.extraText = "Lets duel!";
        });
    fleeAway = new Production("flee",
        Production.priority.High,
        function() {
            return (
                duyen.energy.value > 10 &&
                duyen.emotions.current === "sad");
        },
        function() {
            duyen.currentMotion = Motions.flying;
            duyen.extraText = "I'm outta here!";
        });
    dancingProduction = new Production("dancing",
        Production.priority.Low,
        function() {
            return (
                duyen.emotions.current === "happy" &&
                duyen.hunger.value > 30 &&
                duyen.energy.value > 70);
        },
        function() {
            duyen.currentMotion = Motions.dancing;
        });
}



// Hunger 
duyen.hunger = new DecayVariable(0, 1, 0, 100);
duyen.hunger.toString = function() {
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

//Hygiene
duyen.hygiene = new DecayVariable(0, 1, 0, 100);
duyen.hygiene.toString = function() {
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


duyen.setMotion = function() {
    if (duyen.emotions.current === "happy") {
        duyen.currentMotion = Motions.flying;
    } else if (duyen.emotions.current === "sad") {
        duyen.currentMotion = Motions.floating;
    } else if (duyen.emotions.current === "mad") {
        duyen.currentMotion = Motions.attack;
    } else if (duyen.emotions.current === "calm") {
        let rnd = Math.random();
        if (rnd < .5) {
            duyen.currentMotion = Motions.still;
        } else {
            duyen.currentMotion = Motions.floating;
        }
    }
}

// (Override) Main update.  On my machine this is called about 43 times per second
duyen.pursuitCompleted = function() {
    this.currentMotion.apply(duyen);
    duyen.genericUpdate();
}

// Called every tenth of a second
duyen.updateTenthSec = function() {
    //  No implementation
}

// Called every second
duyen.update1Sec = function() {
    duyen.hunger.increment();
}

// Called every two minutes
duyen.update2min = function() {
    duyen.hunger.eat(101);
}

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