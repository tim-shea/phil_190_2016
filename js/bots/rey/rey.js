/**
 * rey's bot
 */
var rey = new Bot(1500, 1500, 'rey', 'js/bots/rey/whitedeer.png');

/**
 * State variables
 */
rey.currentMotion = Motions.still;

/**
 * Initialize bot
 *
 * @override
 */
rey.init = function() {
    this.body = this.sprite.body;
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 0; // Initial Speed

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, rey.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 10, rey.updateTenSecs, this);
    //game.time.events.loop(Phaser.Timer.SECOND * 60, rey.update1min, this);

    // Make productions.
    eatingProduction1 = new Production("eating",
        Production.priority.High,
        function() {
            return (rey.hunger.value > 10 && rey.hunger.value < 20);
        },
        function() { console.log("Yum"); });
    fleeingProduction = new Production("feeling",
        Production.priority.Low,
        function() {
            return (rey.hunger.value < 10);
        },
        function() { console.log("I need to run away while I still have the energy!"); }); //I'll set this to where it flees only when it is threatened later


    // Populate production list
    this.productions = [eatingProduction1, fleeingProduction];
}



/**
 * Markov process controlling emotions
 */
rey.emotions = new MarkovProcess("Relaxed");
rey.emotions.add("Relaxed", [
    ["Relaxed", "Tired", "Hyper", "Not in the mood"],
    [.4, .2, .3, .1]
]);
rey.emotions.add("Not in the mood", [
    ["Not in the mood", "Relaxed"],
    [.6, .4]
]);
rey.emotions.add("Hyper", [
    ["Hyper", "Relaxed"],
    [.5, .5]
]);
rey.emotions.add("Tired", [
    ["Tired", "Relaxed"],
    [.6, .4]
]);

/**
 * Hunger Variable
 */
rey.hunger = new DecayVariable(0, 1, 0, 40);
rey.hunger.toString = function() {
    var hungerLevel = "";
    if (this.value < 15) {
        hungerLevel = "Not hungry";
    } else if (this.value < 25) {
        hungerLevel = "I'm getting hungry..";
    } else if (this.value < 38) {
        hungerLevel = "Okay, now I am hungry!";
    } else {
        hungerLevel = "FEED ME NOW!";
    }
    return hungerLevel + " (Hunger = " + this.value + ")";
}

/**
 * Populate the status field
 *
 * @override
 */
rey.getStatus = function() {
    var statusString = "Emotion: " + rey.emotions.current;
    statusString += "\nMotion: " + rey.currentMotion.description;
    statusString += "\n" + rey.hunger.toString();
    return statusString;
}

/**
 * Set the current motion state.  Currently updated every second.
 */
rey.setMotion = function() {

    // Default markov chain movement patterns
    // TODO: Add conditions that involve hunger, etc.
    if (rey.emotions.current === "Not in the mood") {
        rey.currentMotion = Motions.still;
    } else if (rey.emotions.current === "Tired") {
        rey.currentMotion = Motions.energysaver;
    } else if (rey.emotions.current === "Relaxed") {
        let rnd = Math.random();
        if (rnd < .5) {
            rey.currentMotion = Motions.dancing;
        } else {
            rey.currentMotion = Motions.energysaver;
        }
    } else if (rey.emotions.current === "Hyper") {
        let rnd = Math.random();
        if (rnd < .5) {
            rey.currentMotion = Motions.spazzing;
        } else {
            rey.currentMotion = Motions.sonicSpeed;
        }
    }
}


//////////////////////
// Update Functions //
//////////////////////

rey.update = function() {

    // Apply current motion
    this.currentMotion.apply(rey);
    rey.genericUpdate();
};


/**
 * Called every second
 */
rey.update1Sec = function() {
    rey.hunger.increment();
    rey.emotions.update();
    rey.setMotion();
    fireProductions(rey.productions);

}




///////////////////////////
// Interaction Functions //
///////////////////////////


/**
 * React to a collision.
 *
 * @override
 */
rey.collision = function(object) {
    // console.log("Object is edible: " + object.isEdible);
    if (object.isEdible) {
        rey.eatObject(object);
    } else {
        rey.speak(object, "What's up " + object.name + "!");
    }

}

rey.eatObject = function(objectToEat) {
    objectToEat.eat();
    rey.hunger.subtract(objectToEat.calories);
    rey.speak(objectToEat, "Ooohh my favorite snack " + objectToEat.description + "!");
}

rey.hear = function(botWhoSpokeToMe, whatTheySaid) {
    rey.speak(botWhoSpokeToMe, "That's awesome " + botWhoSpokeToMe.name + "!"); // TODO: Make more intelligent responses!
}
