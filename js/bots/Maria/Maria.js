var maria = new Bot(311, 1280, 'maria', 'js/bots/Maria/Maria.png');

maria.stateText = "The princess is here!";
maria.speechText = "";

maria.currentMotion = Motions.still;

maria.init = function() {
    maria.body = this.sprite.body;
    maria.body.rotation = 100;
    maria.body.speed = 100;

    //Initialized time updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, maria.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * .01, maria.updateTenthSec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 30, maria.update30Sec, this);
}

/**
 * Markov process controlling emotions
 * @memberOf Maria
 */
maria.emotions = new MarkovProcess("Calm");
maria.emotions.add("Calm", [
    ["Calm", "Happy", "Angry", "Sad"]
    [.5, .2, .15, .15]
]);
maria.emotions.add("Happy", [
    ["Happy", "Calm"],
    [.8, .2]
]);
maria.emotions.add("Sad", [
    ["Sad", "Calm"],
    [.7, .3]
]);
maria.emotions.add("Angry", [
    ["Angry", "Calm"],
    [.4, .6]
]);
maria.emotions.add("Hyper", [
    ["Happy", "Calm"],
    [.5, .5]
]);
maria.emotions.add("Sleepy", [
    ["Happy", "Calm"],
    [.2, .8]
]);

/**
 * Hunger
 * @memberOf Maria
 */

maria.hunger = new DecayVariable(0, 1, 0, 100);
maria.hunger.toString = function() {
        var hungerLevel = "";
        if (this.value < 25) {
            hungerLevel = "Not hungry";
        } else if (this.value < 35) {
            hungerLevel = "Starting to get hungry";
        } else if (this.value < 47) {
            hungerLevel = "I'm hungry!!";
        } else {
            hungerLevel = "I NEED FOOD!";
        }
        return hungerLevel + " (Hunger = " + this.value + ")";
}


/**
 * Populate the status field
 * @override
 */
maria.setMotion = function() {
    //Default markov chain movement patterns
    if (maria.emotions.current === "Sad") {
        maria.currentMotion = Motions.moping;
    } else if (maria.emotions.current === "Happy") {
        maria.currentMotion = Motions.walking;
    } else if (maria.emotions.current === "Calm") {
        let rnd = Math.random();
        if (rnd < .5) {
            maria.currentMotion = Motions.still;
        } else {
            maria.currentMotion = Motions.walking;
        }
    } else if (maria.emotions.current === "Angry") {
        maria.currentMotion = Motions.spazzing;
    } else if (maria.emotions.current === "Hyper") {
        maria.currentMotion = Motions.tantrum;
    }
}


//(Override) Populate status field
maria.getStatus = function() {
    var statusString = "Emotion: " + maria.emotions.name;
    statusString += "\nMotion: " + maria.currentMotion.description;
    statusString += "\n" + maria.hunger.toString();
    statusString += "\nSpeech: " + maria.speechText;
    return statusString;
}




/**
 * Main update called by phaser
 *
 * @memberOf Maria
 * @override
 */
maria.update = function() {
    maria.genericUpdate();
};


//React to a collision
maria.collision = function(object) {
    //console.log("Maria has collided with " + object.name);
    if (!maria.speechText.contains(object.name)) {
        maria.speechText += "Hey there " + object.name + ".";
    }
    maria.speak(object, "Hi " + object.name);
}

/*React when someone talks to me
 *@override
 */
maria.hear = function(botWhoSpokeToMe, whatTheySaid) {
    maria.speak(botWhoSpokeToMe, "Fine by me, " + botWhoSpokeToMe.name);
}

/**
 * React when someone highfives me
 * @override
 */
maria.highFived = function(botWhoHighFivedMe){
    maria.speak(botWhoHighFivedMe, "Hey wassup hello " + botWhoHighFivedMe.name + ".");
}

/**
 * Call this when eating
 */

maria.eatObject = function(objectToEat) {
    objectToEat.eat();
    maria.hunger.subtract(objectToEat.calories);
    maria.speak(objectToEat, "Mmmmm, thanks " + objectToEat.description + ".");
}

//Called every tenth of a second
maria.updateTenthSec = function() {
    //  No implementation
}

// Called every second
maria.update1Sec = function() {
    maria.speechText = "";
    maria.hunger.increment();
    maria.setMotion();
    maria.emotions.update();
}


//Called every 30 seconds
maria.update30Sec = function() {
    maria.hunger.eat(51);
}
