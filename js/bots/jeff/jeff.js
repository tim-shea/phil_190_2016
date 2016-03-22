/**
 * Jeff's bot
 *
 * @namespace Jeff
 * @augments Bot
 */
var jeff = new Bot(540, 520, 'jeff', 'js/bots/jeff/person.png');

/**
 * State variables
 * @memberOf Jeff
 */
jeff.currentlyPursuing = "Nothing";
jeff.currentMotion = Motions.still;
jeff.extraText = "";

/**
 * Initialize bot
 *
 * @memberOf Jeff
 * @override
 */
jeff.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, jeff.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 10, jeff.updateTenSecs, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, jeff.update2min, this);

    // Make productions
    this.makeProductions();
}

/**
 * Create the list of productions for this agent.
 *
 * @memberOf Jeff
 */
jeff.makeProductions = function() {
    hungerProduction = new Production("eating",
        Production.priority.High,
        function() {
            return (
                jeff.hunger.value > 50 &&
                jeff.emotions.current === "Angry");
        },
        function() {
            jeff.currentMotion = Motions.tantrum;
            jeff.extraText = "I need food!";
        });
    admireCar = new Production("admiring car",
        Production.priority.Low,
        function() {
            let d = game.physics.arcade.distanceBetween(jeff.sprite, dylan.sprite);
            if ((d > 40) && (d < 400)) {
                return true;
            };
            return false;
        },
        function() { jeff.speakTimed(dylan, "Nice car!", 5); });

    // Populate production list
    this.productions = [hungerProduction, admireCar];
}


/**
 * Markov process controlling emotions
 * @memberOf Jeff
 */
jeff.emotions = new MarkovProcess("Calm");
jeff.emotions.add("Calm", [
    ["Calm", "Happy", "Angry", "Sad"],
    [.8, .1, .05, .05]
]);
jeff.emotions.add("Sad", [
    ["Sad", "Calm"],
    [.7, .3]
]);
jeff.emotions.add("Angry", [
    ["Angry", "Calm"],
    [.5, .5]
]);
jeff.emotions.add("Happy", [
    ["Happy", "Calm"],
    [.7, .3]
]);

/**
 * Hunger Variable
 * @memberOf Jeff
 */
jeff.hunger = new DecayVariable(0, 1, 0, 100);
jeff.hunger.toString = function() {
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
 * @memberOf Jeff
 * @override
 */
jeff.getStatus = function() {
    var statusString = "Emotion: " + jeff.emotions.current;
    statusString += "\nMotion: " + jeff.currentMotion.description;
    statusString += "\n" + jeff.hunger.toString();
    statusString += "\nExtra text:   " + jeff.extraText;
    // statusString += "\nEntity collisions: " +
    //     jeff.getOverlappingEntities().map(function(item) {
    //         return item.name;
    //     });
    // statusString += "\nBot collisions: " +
    //     jeff.getOverlappingBots().map(function(item) {
    //         return item.name;
    //     });
    statusString += "\nMoving to: " + jeff.currentlyPursuing;
    return statusString;
}

/**
 * Set the current motion state.  Currently updated every second.
 * @memberOf Jeff
 */
jeff.setMotion = function() {

    // Default markov chain movement patterns
    // TODO: Add conditions that involve hunger, etc.
    if (jeff.emotions.current === "Sad") {
        jeff.currentMotion = Motions.moping;
    } else if (jeff.emotions.current === "Happy") {
        jeff.currentMotion = Motions.walking;
    } else if (jeff.emotions.current === "Calm") {
        let rnd = Math.random();
        if (rnd < .5) {
            jeff.currentMotion = Motions.still;
        } else {
            jeff.currentMotion = Motions.walking;
        }
    } else if (jeff.emotions.current === "Angry") {
        jeff.currentMotion = Motions.spazzing;
    }
}

/**
 * When a pursuit is completed reset the pursuit string.
 *
 * @memberOf Jeff
 * @override
 */
jeff.pursuitCompleted = function() {
    jeff.currentlyPursuing = "Nothing";
    this.currentMotion = Motions.still;
}

//////////////////////
// Update Functions //
//////////////////////

/**
 * Main update called by the phaer game object (about 40 times / sec. on my machine).
 *
 * @memberOf Jeff
 * @override
 */
jeff.update = function() {

    // Apply current motion
    this.currentMotion.apply(jeff);
    // "Superclass" update method
    jeff.genericUpdate();
};


/**
 * Called every second
 * @memberOf Jeff
 */
jeff.update1Sec = function() {
    jeff.hunger.increment();
    jeff.emotions.update();
    jeff.setMotion();
    fireProductions(jeff.productions);
}

/**
 * Called every ten seconds
 * @memberOf Jeff
 */
jeff.updateTenSecs = function() {
    // Pursue a random entity
    if (Math.random() < .9) {
        // jeff.currentlyPursuing = this.pursueRandomObject(2000).name;
    }
}

/**
 *  Called every two minutes
 *  @memberOf Jeff
 */
jeff.update2min = function() {
    // jeff.hunger.setValue(0);
}

///////////////////////////
// Interaction Functions //
///////////////////////////

/**
 * React to a collision.
 *
 * @memberOf Jeff
 * @override
 */
jeff.collision = function(object) {
    // console.log("Object is edible: " + object.isEdible);
    if (object.isEdible) {
        jeff.eatObject(object);
    } else {
        jeff.speak(object, "Hello " + object.name);
    }
    // I'm a nice guy
    if (object instanceof Bot) {
        object.highFive();
    }

    // jeff.flee(object);
    // jeff.pursue(object);
}

/**
 * Call this when eating something.  
 *
 * @memberOf Jeff
 * @param {Entity} objectToEat what to eat
 */
jeff.eatObject = function(objectToEat) {
    objectToEat.eat();
    jeff.hunger.subtract(objectToEat.calories);
    jeff.speak(objectToEat, "Yummy " + objectToEat.description + "!");
    sounds.chomp.play();
}

/**
 * @memberOf Jeff
 * @override
 */
jeff.hear = function(botWhoSpokeToMe, whatTheySaid) {
    jeff.speak(botWhoSpokeToMe, "Right on " + botWhoSpokeToMe.name); // TODO: Make more intelligent responses!
}

/**
 * React when someone high fives me.
 *
 * @memberOf Jeff
 * @override
 */
jeff.highFived = function(botWhoHighFivedMe) {
    jeff.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
}