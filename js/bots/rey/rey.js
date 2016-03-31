var rey = new Bot(1200, 1200, 'rey', 'js/bots/rey/whitedeer.png');


rey.currentMotion = Motions.still;

rey.init = function() {
    this.body = this.sprite.body;
    this.body.rotation = 100;
    this.body.speed = 100;


    game.time.events.loop(Phaser.Timer.SECOND * 1, rey.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, rey.update2min, this);

    this.makeProductions();

}

    // Initialize edibility function
    rey.canEat = function(object) {
        if (object.name == "jerry_can" || object.name == "Devil_Fruit_rubber" || object.name == "diet_pepsi") {
            return false;
        } else {
            return object.isEdible;
        }
    }

    // Initialize utility function
    rey.utilityFunction = function(object) {
        if (object instanceof Bot) {
            return 10;
        } else if (object.name == "jerry_can" || object.name == "Devil_Fruit_rubber" || object.name == "diet_pepsi") {
            return -70;
        } else if (object.isEdible) {
            // TODO: Introduce a function that scales calories to utilities 
            return object.calories;
        } else {
            return 1;
        }
    }

rey.makeProductions = function() {
    eatingProduction1 = new Production("eating",
        Production.priority.High,
        function() {
            return (rey.hunger.value > 10 && rey.hunger.value < 20);
        },
        function() { console.log("Yum!"); });

    fleeingProduction = new Production("fleeing",
        Production.priority.High,
        function() {
            return (rey.emotions.current == "Not in the mood");
        },
        function() {
            console.log("Get away from meee!");
        });

    dancingProduction = new Production("dancing",
        Production.priority.High,
        function() {
            return (rey.currentMotion == Motions.dancing);
        },
        function() {
            console.log("Someone come dance with me pls!");
        });

    lookingforfoodProduction = new Production("scavaging",
        Production.priority.Low,
        function() {
            return (rey.hunger.value > 30 && rey.emotions.current !== "Sleepy");
        },
        function() {
            console.log("I need to find me some food..");
        });

    playingProduction = new Production("playing",
        Production.priority.Low,
        function() {
            return (rey.emotions.current == "Hyper");
        },
        function() {
            console.log("Play with me!!");
        });
    sleepingProduction = new Production("sleeping",
        Production.priority.Low,
        function() {
            return (rey.emotions.current == "Sleepy" && rey.hunger.value > 40);
        },
        function() {
            console.log("I'm about to take a nap..");
        });

    this.productions = [eatingProduction1, fleeingProduction, dancingProduction, lookingforfoodProduction, playingProduction, sleepingProduction];
}



rey.emotions = new MarkovProcess("Relaxed");
rey.emotions.add("Relaxed", [
    ["Relaxed", "Hyper", "Sleepy", "Not in the mood"],
    [.6, .3, .05, .05],
]);
rey.emotions.add("Not in the mood", [
    ["Not in the mood", "Sleepy"],
    [.6, .4]
]);
rey.emotions.add("Sleepy", [
    ["Sleepy", "Relaxed"],
    [.5, .5]
]);
rey.emotions.add("Hyper", [
    ["Hyper", "Relaxed", "Sleepy"],
    [.7, .25, .05]
]);


rey.hunger = new DecayVariable(0, 1, 0, 50);
rey.hunger.toString = function() {
    var hungerLevel = "";
    if (this.value < 20) {
        hungerLevel = "Eh, not hungry.";
    } else if (this.value < 35) {
        hungerLevel = "Okay, I'm getting hungry.";
    } else if (this.value < 49) {
        hungerLevel = "I'm starving now..";
    } else {
        hungerLevel = "MOVE I NEED TO EAT!";
    }
    return hungerLevel + " (Hunger = " + this.value + ")";
}


rey.getStatus = function() {
    var statusString = "Emotion: " + rey.emotions.current;
    statusString += "\nMotion: " + rey.currentMotion.description;
    statusString += "\n" + rey.hunger.toString();
    return statusString;
}


rey.setMotion = function() {

    if (rey.emotions.current === "Not in the mood") {
        rey.currentMotion = Motions.still;
    } else if (rey.emotions.current === "Hyper") {
        rey.currentMotion = Motions.sonicSpeed;
    } else if (rey.emotions.current === "Relaxed") {
        let rnd = Math.random();
        if (rnd < .5) {
            rey.currentMotion = Motions.dancing;
        } else {
            rey.currentMotion = Motions.sonicSpeed;
        }
    } else if (rey.emotions.current === "Sleepy") {
        let rnd = Math.random();
        if (rnd < .5) {
            rey.currentMotion = Motions.still;
        } else {
            rey.currentMotion = Motions.moping;
        }
    }
}


rey.update = function() {

    this.currentMotion.apply(rey);
    rey.genericUpdate();
};


rey.update1Sec = function() {
    rey.hunger.increment();
    rey.emotions.update();
    rey.setMotion();
    fireProductions(rey.productions);
}


rey.update2min = function() {}


rey.collision = function(object) {
    rey.moveAwayFrom(object);
    if (object.isEdible) {
        rey.eatObject(object);
    } else {
        rey.speak(object, "What's up " + object.name + "!");
    }

}


rey.eatObject = function(objectToEat) {
    objectToEat.eat();
    rey.hunger.subtract(objectToEat.calories);
    rey.speak(objectToEat, "Yum my favorite " + objectToEat.description + "!");
    sounds.chomp.play();
}


rey.hear = function(botWhoSpokeToMe, whatTheySaid) {
    rey.speak(botWhoSpokeToMe, "Right on " + botWhoSpokeToMe.name);
}


rey.highFived = function(botWhoHighFivedMe) {
    rey.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
}