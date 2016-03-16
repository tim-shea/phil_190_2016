/**
 * Dylan's bot
 * 
 */
var dylan = new Bot(1021, 1000, 'dylan', 'js/bots/dylan/player_car.png');

/**
 * State variable
 */
dylan.currentMotion = Motions.still;

/**
 * Initialize bot
 * @override
 */
dylan.init = function() {
    this.body = this.sprite.body;
    this.body.rotation = 100;
    this.body.speed = 100;

    game.time.events.loop(Phaser.Timer.SECOND * 1, dylan.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 5, dylan.update5Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 4, dylan.update4min, this);


}



dylan.emotions = new MarkovProcess("Calm");
dylan.emotions.add("Calm", [
    ["Calm", "Happy", "Angry", "Sad"],
    [.8, .1, .05, .05]
]);
dylan.emotions.add("Sad", [
    ["Sad", "Calm"],
    [.7, .3]
]);
dylan.emotions.add("Angry", [
    ["Angry", "Calm"],
    [.5, .5]
]);
dylan.emotions.add("Happy", [
    ["Happy", "Calm"],
    [.7, .3]
]);
dylan.emotions.add("Playful," [
    ["Happy", "Calm"],
    [.8, .6]
]);
dylan.emotions.add("Scared," [
    ["Nervous", "Calm"],
    [.7, .3]
]);
dylan.emotions.add("Nervous," [
    ["Scared", "Calm"],
    [.5, .5]
]);

/**
 * Hunger/fuel variable
 */
dylan.fuel = new DecayVariable(0, 1, 0, 100);
dylan.fuel.toString = function() {
    var fuelLevel = "";
    if (this.amount < 20) {
        fuelLevel = "Tank full";
    } else if (this.amount < 60) {
        fuelLevel = "Half tank";
    } else if (this.amount < 80) {
        fuelLevel = "FUEL LOW";
    } else {
        fuelLevel = "FUEL DEPLETION IMMENENT";
    }
    return fuelLevel + " (Fuel = " + this.value + ")";
}

dylan.getStatus = function() {
        var statusString = "Emotion: " + dylan.emotions.current;
        statusString += "\nMotion: " + dylan.currentMotion.description;
        statusString += "\n" + dylan.fuel.toString();
        return statusString;
    }
    /**
     * Populate the status field
     *
     * @override
     */
dylan.setMotion = function() {

    // Default markov chain movement patterns
    // TODO: Add conditions that involve hunger, etc.
    if (dylan.emotions.current === "Sad") {
        dylan.currentMotion = Motions.moping;
    } else if (dylan.emotions.current === "Happy") {
        dylan.currentMotion = Motions.walking;
    } else if (dylan.emotions.current === "Calm") {
        let rnd = Math.random();
        if (rnd < .5) {
            dylan.currentMotion = Motions.still;
        } else {
            dylan.currentMotion = Motions.walking;
        }
    } else if (dylan.emotions.current === "Angry") {
        dylan.currentMotion = Motions.speeding;
    } else if (dylan.emotions.cruuent === "Playful") {
        dylan.currentMotion = Motions.weaving;
    } else if (dylan.emotions.current === "Nervous") {
        dylan.currentMotion = Motions.moping;
    } else if (dylan.emotions.current === "Scared") {
        dylan.currentMotion = Motions.speeding;
    }
}

/**
 * Main updaye called by the phaser game object
 *
 * @override
 */
dylan.update = function() {

    // Apply current motion
    this.currentMotion.apply(dylan);
    // "Superclass" update method
    dylan.genericUpdate();
};



dylan.update1Sec = function() {
    dylan.fuel.increment();
    dylan.emotions.update();
    dylan.setMotion();
}



dylan.update5Sec = function() {

}

dylan.update4min = function() {

}


/**
 * React to a collision.
 *
 * @override
 */

dylan.collision = function(object) {
    // console.log("Object is edible: " + object.isEdible);
    if (object.isEdible) {
        dylan.eatObject(object);
    } else {
        dylan.speak(object, "Move aside " + object.name);
    }


}

/**
 * Call this when eating
 * @param {Entitiy} objectToEat what to eat
 */

dylan.eatObject = function(objectToEat) {
        objectToEat.eat();
        dylan.fuel.subtract(objectToEat.calories);
        dylan.speak(objectToEat, "Weird, I don't usually eat " + objectToEat.description);
    }
    /**
     * Reaction to hearing something
     * @param  {bot} botWhoSpokeToMe the bot talking to this one
     * @param  {String} whatTheySaid    what they said
     * 
     */
dylan.hear = function(botWhoSpokeToMe, whatTheySaid) {
        dylan.speak(botWhoSpokeToMe, "Alright " + botWhoSpokeToMe.name); // TODO: Make more intelligent responses!
    }
    /**
     * React when someone high fives me
     *
     * @override
     */
dylan.highFived = function(botWhoHighFivedMe) {
    dylan.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
}
