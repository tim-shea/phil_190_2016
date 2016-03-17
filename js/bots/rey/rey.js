/**
 * rey's bot
 *
 * @namespace rey
 * @augments Bot
 */
var rey = new Bot(1200, 1200, 'rey', 'js/bots/rey/whitedeer.png');

/**
 * State variables
 * @memberOf rey
 */

rey.currentMotion = Motions.still;

/**
 * Initialize bot
 *
 * @memberOf rey
 * @override
 */
rey.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, rey.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 10, rey.updateTenSecs, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, rey.update2min, this);

    // Make productions.  Very dumb productions for now.
    eatingProduction1 = new Production("eating", 
        Production.priority.High, 
        function() {return (rey.hunger.value > 10 && rey.hunger.value < 20 );},
        function() {console.log("Eating 1");});
    

    // Populate production list
    this.productions = [eatingProduction1];
}



/**
 * Markov process controlling emotions
 * @memberOf rey
 */
rey.emotions = new MarkovProcess("Relaxed");
rey.emotions.add("Relaxed", [
    ["Relaxed", "Hyper", "Sleepy", "Not in the mood"],
    [.6, .3, .05, .05]
]);
rey.emotions.add("Not in the mood", [
    ["Not in the mood", "Relaxed"],
    [.6, .4]
]);
rey.emotions.add("Sleepy", [
    ["Sleepy", "Relaxed"],
    [.5, .5]
]);
rey.emotions.add("Hyper", [
    ["Hyper", "Relaxed"],
    [.6, .4]
]);

/**
 * Hunger Variable
 * @memberOf rey
 */
rey.hunger = new DecayVariable(0, 1, 0, 100);
rey.hunger.toString = function() {
    var hungerLevel = "";
    if (this.value < 20) {
        hungerLevel = "Not hungry";
    } else if (this.value < 60) {
        hungerLevel = "Hungry";
    } else if (this.value < 80) {
        hungerLevel = "Starving!!";
    } else {
        hungerLevel = "FEED ME!";
    }
    return hungerLevel + " (Hunger = " + this.value + ")";
}

/**
 * Populate the status field
 *
 * @memberOf rey
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
 * @memberOf rey
 */
rey.setMotion = function() {

    // Default markov chain movement patterns
    // TODO: Add conditions that involve hunger, etc.
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

/**
 *
 * @memberOf rey
 * @override
 */
rey.pursuitCompleted = function() {
    rey.currentlyPursuing = "Nothing";
    this.currentMotion = Motions.still;
}

//////////////////////
// Update Functions //
//////////////////////

/**
 * Main update called by the phaer game object (about 40 times / sec. on my machine).
 *
 * @memberOf rey
 * @override
 */
rey.update = function() {

    // Apply current motion
    this.currentMotion.apply(rey);
    // "Superclass" update method
    rey.genericUpdate();
};


/**
 * Called every second
 * @memberOf rey
 */
rey.update1Sec = function() {
    rey.hunger.increment();
    rey.emotions.update();
    rey.setMotion();
    // fireProductions(rey.productions);
}

/**
 * Called every ten seconds
 * @memberOf rey
 */
rey.updateTenSecs = function() {
    // Pursue a random entity
    if (Math.random() < .9) {
        // rey.currentlyPursuing = this.pursueRandomObject(2000).name;
    }
}

/**
 *  Called every two minutes
 *  @memberOf rey
 */
rey.update2min = function() {
    // rey.hunger.setValue(0);
}

///////////////////////////
// Interaction Functions //
///////////////////////////

/**
 * React to a collision.
 *
 * @memberOf rey
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

/**
 * Call this when eating something.  
 *
 * @memberOf rey
 * @param {Entity} objectToEat what to eat
 */
rey.eatObject = function(objectToEat) {
    objectToEat.eat();
    rey.hunger.subtract(objectToEat.calories);
    rey.speak(objectToEat, "Yum my favorite " + objectToEat.description + "!");
    sounds.chomp.play();
}

/**
 * @memberOf rey
 * @override
 */
rey.hear = function(botWhoSpokeToMe, whatTheySaid) {
    rey.speak(botWhoSpokeToMe, "Right on " + botWhoSpokeToMe.name); // TODO: Make more intelligent responses!
}

/**
 * React when someone high fives me.
 *
 * @memberOf rey
 * @override
 */
rey.highFived = function(botWhoHighFivedMe) {
    rey.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
}
