/**
 * sharAI's bot
 *
 * @namespace sharAI
 * @augments Bot
 */
var sharAI = new Bot(2950, 75, 'sharAI', 'js/bots/sharAI/sharAI.png');

/**
 * State variables
 * @memberOf sharAI
 */
sharAI.motionText = "sharAI is getting ready";
sharAI.currentMotion = Motions.stop;
sharAI.ear = "";
sharAI.inedibles = ["cupCake", "diet_pepsi", "jerry_can", "Spicy_Poffin", "Devil_Fruit_rubber", "pink_candy", "Cream_Cake"];

/**
 * Initialize bot
 *
 * @memberOf sharAI
 * @override
 */
sharAI.init = function() {
    this.body = this.sprite.body;
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, sharAI.updatePerSec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 5, sharAI.updateFiveSecs, this);

    // Make productions
    this.makeProductions();

    sharAI.setNetwork();
}

/**
 * Initialize edibility function
 * 
 * @param  {object} object object to check
 * @return {boolean}        is this object edible?
 */
sharAI.canEat = function(object) {
    for (i = 0; i < sharAI.inedibles; i++) {
        if (object.name == sharAI.inedibles[i]) {
            return false;
        }

        return object.isEdible;
    }
}

sharAI.utilityFunction = function(object) {
        if (object instanceof Bot) {
            if (object.name != "dylan") {
                return 30;
            }
            else {
                return -50;
            }
        } else if (object.name == "web" || object.name == "cocoon") {
            return 70;
        } else if (sharAI.canEat()) {
            return object.calories;
        } else {
            return 0;
        }
    }

/**
 * Create the list of productions for this agent.
 *
 * @memberOf sharAI
 */
sharAI.makeProductions = function() {
    getFood = new Production("hunting");
    getFood.priority = 10;
    getFood.condition = function() {
        return (sharAI.hunger.value > 50);
    }
    getFood.action = function() {
        sharAI.findFood(100, sharAI.canEat);
        sharAI.motionText = "sharAI is looking for their next meal";
    }

    sleep = new Production("sleeping");
    sleep.priority = 10;
    sleep.condition = function() {
        return (sharAI.lethargy.value > 75);
    }
    sleep.action = function() {
        sharAI.currentMotion = Motions.still;
        sharAI.motionText = "sharAI is sleeping";
        sharAI.makeSpeechBubble("Zzz...");
    }

    returnHome = new Production("going home");
    returnHome.priority = 7;
    returnHome.condition = function() {
        return (sharAI.energyLevel == "Anxious" || sharAI.health.value < 25);
    }
    returnHome.action = function() {
        sharAI.orientTowards(web);
        sharAI.goHome();
    }

    curse = new Production("cursing");
    curse.priority = 0;
    curse.condition = function() {
        return (sharAI.mood == "Angry");
    }
    curse.action = function() {
        sharAI.makeSpeechBubble("\*\@\$\#!");
    }

    // Populate production list
    this.productions = [getFood, sleep, returnHome, curse];
}

/**
 * Markov process controlling energy level
 * @memberOf sharAI
 */
sharAI.energyLevel = new MarkovProcess("Calm");
sharAI.energyLevel.add("Calm", [
    ["Content", "Anxious", "Calm"],
    [.1, .1, .8]
]);
sharAI.energyLevel.add("Content", [
    ["Content", "Anxious", "Calm"],
    [.8, .1, .1]
]);
sharAI.energyLevel.add("Anxious", [
    ["Content", "Anxious", "Calm"],
    [.1, .8, .1]
]);

/**
 * Markov process controlling mood
 * @memberOf sharAI
 */
sharAI.mood = new MarkovProcess("Happy");
sharAI.mood.add("Happy", [
    ["Happy", "Sad", "Angry", "Fearful"],
    [.7, .1, .1, .1]
]);
sharAI.mood.add("Sad", [
    ["Happy", "Sad", "Angry", "Fearful"],
    [.1, .7, .1, .1]
]);
sharAI.mood.add("Angry", [
    ["Happy", "Sad", "Angry", "Fearful"],
    [.1, .1, .7, .1]
]);
sharAI.mood.add("Fearful", [
    ["Happy", "Sad", "Angry", "Fearful"],
    [.1, .1, .1, .7]
]);

/**
 * Hunger Variable
 * @memberOf sharAI
 */
sharAI.hunger = new DecayVariable(0, 1, 0, 100);
sharAI.hunger.toString = function() {
    let hungerBar = "Hunger:\t\t";
    let hungerAmount = Math.floor(sharAI.hunger.value / 10);
    let iCount = 0;
    for (i = 0; i < hungerAmount; i++) {
        hungerBar += "▓"
        iCount++;
    }
    for (i = 0; i < (10 - iCount); i++) {
        hungerBar += "░"
    }
    return hungerBar;
}

/**
 * Lethargy Variable
 * @memberOf sharAI
 */
sharAI.lethargy = new DecayVariable(0, 1, 0, 100);
sharAI.lethargy.toString = function() {
    let lethargyBar = "Lethargy:\t\t";
    let lethargyAmount = Math.floor(sharAI.lethargy.value / 10);
    let iCount = 0;
    for (i = 0; i < lethargyAmount; i++) {
        lethargyBar += "▓"
        iCount++;
    }
    for (i = 0; i < (10 - iCount); i++) {
        lethargyBar += "░"
    }
    return lethargyBar;
}

/**
 * Exhaustion Variable
 * @memberOf sharAI
 */
sharAI.exhaustion = new DecayVariable(0, 1, 0, 100);
sharAI.exhaustion.toString = function() {
    let exhaustionBar = "Exhaustion:\t";
    let exhaustionAmount = Math.floor(sharAI.exhaustion.value / 10);
    let iCount = 0;
    for (i = 0; i < exhaustionAmount; i++) {
        exhaustionBar += "▓"
        iCount++;
    }
    for (i = 0; i < (10 - iCount); i++) {
        exhaustionBar += "░"
    }
    return exhaustionBar;
}

/**
 * Boredom Variable
 * @memberOf sharAI
 */
sharAI.boredom = new DecayVariable(0, 1, 0, 100);
sharAI.boredom.toString = function() {
    let boredomBar = "Boredom:\t\t";
    let boredomAmount = Math.floor(sharAI.boredom.value / 10);
    let iCount = 0;
    for (i = 0; i < boredomAmount; i++) {
        boredomBar += "▓"
        iCount++;
    }
    for (i = 0; i < (10 - iCount); i++) {
        boredomBar += "░"
    }
    return boredomBar;
}

/**
 * Health Variable
 * @memberOf sharAI
 */
sharAI.health = new DecayVariable(100, 1, 0, 100);
sharAI.health.toString = function() {
    let healthBar = "Health:\t\t";
    let healthAmount = Math.floor(sharAI.health.value / 10);
    let iCount = 0;
    for (i = 0; i < healthAmount; i++) {
        healthBar += "▓"
        iCount++;
    }
    for (i = 0; i < (10 - iCount); i++) {
        healthBar += "░"
    }
    return healthBar;
}

/**
 * Populate the status field
 *
 * @memberOf sharAI
 * @override
 */
sharAI.getStatus = function() {
    let statusString = sharAI.health.toString() + "\n" + sharAI.hunger.toString() + "\n" + sharAI.lethargy.toString() + "\n" + sharAI.exhaustion.toString() + "\n" + sharAI.boredom.toString() + "\n" + sharAI.motionText + "\n" + sharAI.ear;
    return statusString;
}

/**
 * Set the current motion state.  Currently updated every second.
 * @memberOf sharAI
 */
sharAI.setMotion = function() {
    let rnd = Math.random();
    if (sharAI.energyLevel.current === "Calm") {
        if (sharAI.mood.current === "Happy") {
            sharAI.currentMotion = Motions.stop;
            sharAI.motionText = "sharAI is curled up all cozy";
        } else if (sharAI.mood.current === "Sad") {
            sharAI.currentMotion = Motions.still;
            sharAI.motionText = "sharAI is staring at the ground";
        } else if (sharAI.mood.current === "Angry") {
            sharAI.currentMotion = Motions.moping;
            sharAI.motionText = "sharAI is brooding";
        } else {
            sharAI.currentMotion = Motions.walking;
            sharAI.motionText = "sharAI is pacing";
        }
    } else if (sharAI.energyLevel.current === "Content") {
        if (sharAI.mood.current === "Happy") {
            sharAI.currentMotion = Motions.walking;
            sharAI.motionText = "sharAI is going on a walk";
        } else if (sharAI.mood.current === "Sad") {
            sharAI.currentMotion = Motions.moping;
            sharAI.motionText = "sharAI is trying to hide their face";
        } else if (sharAI.mood.current === "Angry") {
            sharAI.currentMotion = Motions.stop;
            sharAI.motionText = "sharAI is grinding their maxilla";
        } else {
            sharAI.currentMotion = Motions.running;
            sharAI.motionText = "sharAI is in a hurry";
        }
    } else {
        if (sharAI.mood.current === "Happy") {
            sharAI.currentMotion = Motions.dancing;
            sharAI.motionText = "sharAI is jumping and twirling";
        } else if (sharAI.mood.current === "Sad") {
            sharAI.currentMotion = Motions.spazzing;
            sharAI.motionText = "sharAI can\'t hide their sorrow";
        } else if (sharAI.mood.current === "Angry") {
            sharAI.currentMotion = Motions.tantrum;
            sharAI.motionText = "sharAI is cursing and flailing their legs";
        } else {
            sharAI.currentMotion = Motions.still;
            sharAI.motionText = "sharAI is paralyzed stiff with fear";
        }
    }
}

/**
 * Increments or decrements decay variables based on the current motion type
 * 
 * @memberOf sharAI
 */
sharAI.incrementDecayVariables = function() {
    if (sharAI.currentMotion == Motions.still) {
        sharAI.exhaustion.decrement();
        sharAI.boredom.increment();
        sharAI.lethargy.decrement();
    } else if (sharAI.currentMotion == Motions.stop) {
        sharAI.exhaustion.decrement();
        sharAI.lethargy.increment();
    } else if (sharAI.currentMotion == Motions.spazzing) {
        sharAI.exhaustion.add(3);
        sharAI.boredom.decrement();
        sharAI.lethargy.increment();
    } else if (sharAI.currentMotion == Motions.walking) {
        sharAI.exhaustion.increment();
        sharAI.boredom.increment();
        sharAI.lethargy.increment();
    } else if (sharAI.currentMotion == Motions.running) {
        sharAI.exhaustion.add(2);
        sharAI.lethargy.increment();
    } else if (sharAI.currentMotion == Motions.tantrum) {
        sharAI.exhaustion.add(3);
        sharAI.lethargy.increment();
    } else if (sharAI.currentMotion == Motions.dancing) {
        sharAI.exhaustion.increment(2);
        sharAI.boredom.decrement();
        sharAI.lethargy.increment();
    }
    // Motions.moping doesn't have additional increments or decrements that isn't shared by all movement types
    // Always increment hunger no matter what motion state sharAI's in
    sharAI.hunger.increment();
}

/**
 * Will heal sharAI when called if conditions are met
 * 
 * @memberOf sharAI
 */
sharAI.regenerateHealth = function() {
    if (sharAI.hunger.value < 50 && sharAI.lethargy.value < 50 && sharAI.exhaustion.value < 50) {
        sharAI.health.increment();
    }
}

//////////////////////
// Update Functions //
//////////////////////

/**
 * Main update called by the phaer game object (about 40 times / sec. on my machine).
 *
 * @memberOf sharAI
 * @override
 */
sharAI.update = function() {

    // Apply current motion
    sharAI.currentMotion.apply(sharAI);
    // "Superclass" update method
    sharAI.genericUpdate();
};


/**
 * Called every second
 * @memberOf sharAI
 */
sharAI.updatePerSec = function() {
	sharAI.updateNetwork();
    sharAI.incrementDecayVariables();
    fireProductions(sharAI.productions);
}

/**
 * Called every ten seconds
 * @memberOf sharAI
 */
sharAI.updateFiveSecs = function() {
    sharAI.regenerateHealth();
    sharAI.energyLevel.update();
    sharAI.mood.update();
    sharAI.setMotion();
}

///////////////////////////
// Interaction Functions //
///////////////////////////

/**
 * React to a collision.
 *
 * @memberOf sharAI
 * @override
 */
sharAI.collision = function(object) {
	sharAI.addMemory("Saw " + object.name);
    if (object.canEat) {
        sharAI.eatObject(object);
    } else if (object instanceof Bot) {
        sharAI.speak(object, "How you doin\', " + object.name + "?");
        object.highFive();
    } else if (object.name != "web") {
        sharAI.moveAwayFrom(object);
    }
}

/**
 * Call this when eating something.  
 *
 * @memberOf sharAI
 * @param {Entity} objectToEat what to eat
 */
sharAI.eatObject = function(objectToEat) {
	jeff.addMemory("Ate " + objectToEat.name);
    objectToEat.eat();
    sharAI.hunger.subtract(objectToEat.calories);
    sharAI.speak(objectToEat, "Om nom nom");
    sounds.chomp.play();
}

/**
 * @memberOf sharAI
 * @override
 */
sharAI.hear = function(botWhoSpokeToMe, whatTheySaid) {
    sharAI.ear = botWhoSpokeToMe.name + " says: " + whatTheySaid;
    sharAI.addMemory(botWhoSpokeToMe.name + " said \"" + whatTheySaid + "\"");
}

/**
 * React when someone high fives me.
 *
 * @memberOf sharAI
 * @override
 */
sharAI.highFived = function(botWhoHighFivedMe) {
    sharAI.boredom.subtract(5);
    sharAI.addMemory("High Fived: " + botWhoHighFivedMe.name);
}

/**
 * Override of Bot.gotBit
 *
 * @memberOf sharAI
 * @override
 */
sharAI.gotBit = function(botWhoAttackedMe, damage) {
	sharAI.addMemory("Got bit by " + botWhoAttackedMe.name);
    sharAI.speak(botWhoAttackedMe, "Ow! You'll pay for that, " + botWhoAttackedMe.name + "!");
    sharAI.bite(botWhoAttackedMe, 25, 25);
}

/**
 * Override of Bot.antler_caressed
 *
 * @memberOf sharAI
 * @override
 */
sharAI.antler_caressed = function(botWhoCaressedMe, message) {
    sharAI.hear(botWhoCaressedMe, message);
    sharAI.addMemory(botWhoCaressedMe.name + " caressed me with their antlers")
    sharAI.speak(botWhoCaressedMe, "Hey! Don't rub your horns on me, " + botWhoCaressedMe.name + "!");
}

/**
 * Override of Bot.gotBow
 *
 * @memberOf sharAI
 * @override
 */
sharAI.gotBow = function(botWhoBowed) {
	sharAI.addMemory(botWhoBowed.name + " bowed to me");
    sharAI.speak(botWhoBowed, "What are you bending your body for, " + botWhoBowed.name + "?");
}

/**
 * Override of Bot.gotLicked
 *
 * @memberOf sharAI
 * @override
 */
sharAI.gotLicked = function(botWhoLickedMe) {
	sharAI.addMemory(botWhoLickedMe.name + " licked me");
    sharAI.speak(botWhoLickedMe, "Haha! My turn, " + botWhoLickedMe.name + "!");
    sharAI.lick(botWhoLickedMe);
    sharAI.boredom.subtract(5);
}

/**
 * Override of Bot.gotIgnored
 *
 * @memberOf sharAI
 * @override
 */
sharAI.gotIgnored = function(botWhoIgnoredMe) {
	sharAI.addMemory(botWhoIgnoredMe.name + " ignored me");
    sharAI.speak(botWhoIgnoredMe, "Hey, pay attention to me, " + botWhoIgnoredMe.name + "!");
}

