/**
 * Jeff's bot
 */
var jeff = new Bot(540, 520, 'jeff', 'js/bots/jeff/person.png');

/**
 * State variables
 */
jeff.pursuitMode = false;
jeff.currentlyPursuing = "Nothing";
jeff.speechText = "";
jeff.currentMotion = Motions.still;

/**
 * Initialize bot
 *
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
}

/**
 * Markov process controlling emotions
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
 * @override
 */
jeff.getStatus = function() {
    var statusString = "Emotion: " + jeff.emotions.current;
    statusString += "\nMotion: " + jeff.currentMotion.description;
    statusString += "\n" + jeff.hunger.toString();
    // statusString += "\nEntity collisions: " +
    //     jeff.getOverlappingEntities().map(function(item) {
    //         return item.name;
    //     });
    // statusString += "\nBot collisions: " +
    //     jeff.getOverlappingBots().map(function(item) {
    //         return item.name;
    //     });
    statusString += "\nMoving to: " + jeff.currentlyPursuing;
    statusString += "\nSpeech: " + jeff.speechText;
    return statusString;
}

/**
 * Main update called by the phaer game object (about 40 times / sec. on my machine).
 *
 * @override
 */
jeff.update = function() {
    // Handle boundary collissions
    if (this.atBoundary() === true) {
        this.incrementAngle(45); // Todo: create a bot-level bounce function, or world wrap.
    }
    // Apply current motion
    if(!this.pursuitMode) {
        this.currentMotion.apply(jeff);
    }
    // "Superclass" update method
    jeff.genericUpdate();
};

/**
 * React to a collision.
 *
 * @override
 */
jeff.collision = function(object) {
    // console.log("Object is edible: " + object.isEdible);
    if (!jeff.speechText.contains(object.name)) {
        jeff.speechText += " Hello " + object.name + ".";
    }
    jeff.speak(object, "Hello " + object.name);
    // jeff.flee(object);
    // jeff.pursue(object);
}

/**
 * React when someone talks to me.
 *
 * @override
 */
jeff.hear = function(botWhoSpokeToMe, whatTheySaid) {
    if (!jeff.speechText.contains("Oh you")) {
        jeff.speechText += " Oh you just said " + whatTheySaid + ".";
    }
}

/**
 * React when someone high fives me.
 *
 * @override
 */
jeff.highFived = function(botWhoHighFivedMe) {
    if (!jeff.speechText.contains("high five")) {
        jeff.speechText += " Thanks for the high five " + botWhoHighFivedMe.name + ".";
    }
}

/**
 * Set the current motion state.  Currently updated every second.
 */
jeff.setMotion = function() {

    // If in pursuit mode, don't do default behavior
    if(jeff.pursuitMode) {
        return;
    }

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
 * Called every second
 */
jeff.update1Sec = function() {
    jeff.hunger.increment();
    jeff.speechText = "";
    jeff.emotions.update();
    jeff.setMotion();
}

/**
 * Called every ten seconds
 */
jeff.updateTenSecs = function() {
    // Enter pursuit mode X% of the time
    if (Phaser.Math.chanceRoll(40)) {
        jeff.pursuitMode = true
        jeff.currentlyPursuing = this.pursueRandomObject(700).name;
    } else {
        jeff.pursuitMode = false;
        jeff.currentlyPursuing = "Nothing";
    }
}

/**
 *  Called every two minutes
 */
jeff.update2min = function() {
    jeff.hunger.setValue(0);
}