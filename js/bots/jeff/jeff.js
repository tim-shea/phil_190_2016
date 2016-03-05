var jeff = new Bot(540, 520, 'jeff', 'js/bots/jeff/person.png');

// State variables
jeff.pursuitMode = false;
jeff.currentlyPursuing = "Nothing";
jeff.talkText = "";
jeff.currentMotion = Motions.still;

// (Override) Initialize Bot
jeff.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, jeff.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 10, jeff.updateTenSecs, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, jeff.update2min, this);
}

//
// Markov chain controlling emotions
//
jeff.emotions = new MarkovChain("Calm");
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

// Hunger Variable
jeff.hunger = new DecayVariable(0, 1, 0, 100);
jeff.hunger.toString = function() {
    var hungerLevel = "";
    if (jeff.hunger.value < 20) {
        hungerLevel = "Not hungry";
    } else if (jeff.hunger.value < 60) {
        hungerLevel = "Hungry";
    } else if (jeff.hunger.value < 80) {
        hungerLevel = "Starving!!";
    } else {
        hungerLevel = "FEED ME!";
    }
    return hungerLevel + " (Hunger = " + jeff.hunger.value + ")";
}

// (Override) Populate status field
jeff.getStatus = function() {
    var statusString = "Emotion: " + jeff.emotions.current;
    statusString += "\nMotion: " + jeff.currentMotion.description;
    statusString += "\n" + jeff.hunger.toString();
    statusString += "\nEntity collisions: " +
        jeff.getOverlappingEntities().map(function(item) {
            return item.name;
        });
    statusString += "\nBot collisions: " +
        jeff.getOverlappingBots().map(function(item) {
            return item.name;
        });
    statusString += "\nMoving to: " +
        jeff.currentlyPursuing;
    statusString += "\nSpeech: " +
        jeff.talkText;
    return statusString;
}

// (Override) Main update.  On my machine this is called about 43 times per second
jeff.update = function() {
    if (this.atBoundary() === true) {
        this.incrementAngle(45);
    }
    if (!this.pursuitMode) {
        this.currentMotion.apply(jeff);
    }
    this.collisionCheck(); // Must call this for collision to work.
};

/**
 * React to a collision.
 * @override
 */
jeff.collision = function(object) {
    if (!jeff.talkText.contains("Hello")) {
        jeff.talkText += " Hello " + object.name + ".";
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
    if (!jeff.talkText.contains("Oh you")) {
        jeff.talkText += " Oh you just said " + whatTheySaid + ".";
    }
}

/**
 * React when someone high fives me.
 *
 * @override
 */
jeff.highFived = function(botWhoHighFivedMe) {
    if (!jeff.talkText.contains("high five")) {
        jeff.talkText += " Thanks for the high five " + botWhoHighFivedMe.name + ".";
    }
}

// Called every second
jeff.update1Sec = function() {
    jeff.hunger.increment();
    jeff.talkText = "";
    jeff.emotions.update();
    jeff.setMotion();
}

// Set the current motion state
jeff.setMotion = function() {
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

// Called every ten seconds
jeff.updateTenSecs = function() {
    // Enter pursuit mode 80% of the time
    if (Phaser.Math.chanceRoll(80)) {
        jeff.pursuitMode = true;
        jeff.currentlyPursuing = this.pursueRandom(500).name;
    } else {
        jeff.pursuitMode = false;
        jeff.currentlyPursuing = "Nothing";
    }
}

// Called every two minutes
jeff.update2min = function() {
    jeff.hunger.setValue(0);
}
