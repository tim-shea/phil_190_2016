/**
 * faust's bot
 */
var faust = new Bot(300, 300, 'faust', 'js/bots/faust/faust.png');

/**
 * State variables
 */
faust.currentlyPursuing = "Nothing";
faust.currentMotion = Motions.still;

/**
 * Initialize bot
 *
 * @override
 */
faust.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, faust.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 10, faust.updateTenSecs, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, faust.update2min, this);

    // Make productions.  Very dumb productions for now.
    eatingProduction1 = new Production("eating", 
        Production.priority.High, 
        function() {return (faust.hunger.value > 10 && faust.hunger.value < 20 );},
        function() {console.log("Eating 1");});
    eatingProduction2 = new Production("eating", 
        Production.priority.Low, 
        function() {return (faust.hunger.value > 20 && faust.hunger.value < 30);},
        function() {console.log("Eating 2");});
    eatingProduction3 = new Production("eating", 
        3, 
        function() {return (faust.hunger.value > 30 && faust.hunger.value < 40);},
        function() {console.log("Eating 3");});

    // Populate production list
    this.productions = [eatingProduction1, eatingProduction2, eatingProduction3];
}



/**
 * Markov process controlling emotions
 */
faust.emotions = new MarkovProcess("Calm");
faust.emotions.add("Calm", [
    ["Calm", "Upbeat", "Happy", "Angry", "Sad"],
    [.6, .2, .1, .05, .05]
]);
faust.emotions.add("Upbeat", [
    ["Upbeat", "Calm", "Happy",],
    [.5, .3, .2,]
]);
faust.emotions.add("Sad", [
    ["Sad", "Calm"],
    [.7, .3]
]);
faust.emotions.add("Angry", [
    ["Angry", "Calm"],
    [.5, .5]
]);
faust.emotions.add("Happy", [
    ["Happy", "Upbeat", "Calm"],
    [.6, .3, .1]
]);

/**
 * Hunger Variable
 */
faust.hunger = new DecayVariable(0, 1, 0, 100);
faust.hunger.toString = function() {
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
 * @override
 */
faust.getStatus = function() {
    var statusString = "Emotion: " + faust.emotions.current;
    statusString += "\nMotion: " + faust.currentMotion.description;
    statusString += "\n" + faust.hunger.toString();
    // statusString += "\nEntity collisions: " +
    //     faust.getOverlappingEntities().map(function(item) {
    //         return item.name;
    //     });
    // statusString += "\nBot collisions: " +
    //     faust.getOverlappingBots().map(function(item) {
    //         return item.name;
    //     });
    statusString += "\nMoving to: " + faust.currentlyPursuing;
    return statusString;
}

/**
 * Set the current motion state.  Currently updated every second.
 */
faust.setMotion = function() {

    // Default markov chain movement patterns
    // TODO: Add conditions that involve hunger, etc.
    if (faust.emotions.current === "Sad") {
        faust.currentMotion = Motions.moping;
    } else if (faust.emotions.current === "Happy") {
        faust.currentMotion = Motions.takingFlight;
    } else if (faust.emotions.current === "Calm") {
        let rnd = Math.random();
        if (rnd < .5) {
            faust.currentMotion = Motions.still;
        } else {
            faust.currentMotion = Motions.walking;
        }
    } else if (faust.emotions.current === "Upbeat") {
        let rnd = Math.random();
        if (rnd < .5) {
            faust.currentMotion = Motions.running;
        } else {
            faust.currentMotion = Motions.weaving;
        }
    } else if (faust.emotions.current === "Angry") {
        faust.currentMotion = Motions.spazzing;
    }
}

/**
 * When a pursuit is completed reset the pursuit string.
 */
faust.pursuitCompleted = function() {
    faust.currentlyPursuing = "Nothing";
    this.currentMotion = Motions.still;
}

//////////////////////
// Update Functions //
//////////////////////

/**
 * Main update called by the phaer game object (about 40 times / sec. on my machine).
 *
 * @override
 */
faust.update = function() {

    // Apply current motion
    this.currentMotion.apply(faust);
    // "Superclass" update method
    faust.genericUpdate();
};


/**
 * Called every second
 */
faust.update1Sec = function() {
    faust.hunger.increment();
    faust.emotions.update();
    faust.setMotion();
    fireProductions(faust.productions);

}

/**
 * Called every ten seconds
 */
faust.updateTenSecs = function() {
    // Pursue a random entity
    if (Math.random() < .9) {
        // faust.currentlyPursuing = this.pursueRandomObject(2000).name;
    }
}

/**
 *  Called every two minutes
 */
faust.update2min = function() {
    // faust.hunger.setValue(0);
}

///////////////////////////
// Interaction Functions //
///////////////////////////


/**
 * React to a collision.
 *
 * @override
 */
faust.collision = function(object) {
    // console.log("Object is edible: " + object.isEdible);
    if (object.isEdible) {
        faust.eatObject(object);
    } else {
        faust.speak(object, "Hello " + object.name);
    }
    // I'm a nice guy
    if (object instanceof Bot) {
        object.highFive();
    }

    // faust.flee(object);
    // faust.pursue(object);
 }

/**
 * Call this when eating something.  
 *
 * @param {Entity} objectToEat what to eat
 */
faust.eatObject = function(objectToEat) {
    objectToEat.eat();
    faust.hunger.subtract(objectToEat.calories);
    faust.speak(objectToEat, "Yummy " + objectToEat.description + "!");
}

/**
 * Reaction to hearing something.
 *
 * @override
 */
faust.hear = function(botWhoSpokeToMe, whatTheySaid) {
    faust.speak(botWhoSpokeToMe, "Right on " + botWhoSpokeToMe.name); // TODO: Make more intelligent responses!
}

/**
 * React when someone high fives me.
 *
 * @override
 */
faust.highFived = function(botWhoHighFivedMe) {
    faust.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
}
