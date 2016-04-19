var maria = new Bot(311, 1280, 'maria', 'js/bots/Maria/Maria.png');

maria.stateText = "The princess is here!";
maria.speechText = "";
maria.currentlyPursuing = "Nothing";
maria.productionString = "";
maria.currentMotion = Motions.still;
maria.stopMotion = false;

maria.init = function() {
    maria.body = this.sprite.body;
    maria.body.rotation = 100;
    maria.body.speed = 100;

    //Initialized time updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, maria.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * .01, maria.updateTenthSec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 30, maria.update30Sec, this);

    // Make productions
    this.makeProductions();

    // Create the goal set
    this.goals = new GoalSet();
}

// Initialize edibility function
maria.canEat = function(object) {
    if (object.name == "jerry_can") {
        return false;
    } else {
        return object.isEdible;
    }
    // Initialize utility function
    maria.utilityFunction = function(object) {
        if (object instanceof Bot) {
            return 10;
        } else if (object.name == "jerry_can") {
            return -70;
        } else if (object.isEdible) {
            // TODO: Introduce a function that scales calories to utilities 
            return object.calories;
        } else {
            return 1;
        }
    }
}

/**
 * Make productions
 */
maria.makeProductions = function() {


    this.productions = []; // The production array

    /*Trap a bot production*/
    var trapBotGoal = new Production("trap a bot when need food");
    trapBotGoal.priority = Production.priority.Low;
    trapBotGoal.condition = function() {
        return (maria.emotions.current === "hyper");
    };
    trapBotGoal.action = function() {
        maria.addMemory("add goal of trapping bot when hyper");
        maria.goals.add("trap a bot");
        maria.makeSpeechBubble("I trapped you", 40);
    };
    this.productions.push(trapBotGoal);

    var makeAlly = new Production("make an ally");
    makeAlly.priority = Production.priority.High;
    makeAlly.condition = function() {
        return (maria.goals.contains("make ally"));
    };
    makeAlly.action = function() {
        maria.makeAlly(maria.orientToward = randomBot);
        maria.addMemory("I have a new ally!");
        maria.makeSpeechBubble("made Ally", 40);
    };
    this.productions.push(makeAlly);



    var foodSeekingGoal = new Production("want food when hungry");
    foodSeekingGoal.priority = Production.priority.High;
    foodSeekingGoal.condition = function() {
        return (maria.hunger.value > 35);
    };
    foodSeekingGoal.action = function() {
        maria.addMemory("Added goal of finding food");
        maria.goals.add(new Goal("Find food", 8));
    };
    this.productions.push(foodSeekingGoal);

    var getFood = new Production("Get me food now!");
    getFood.priority = Production.priority.High;
    getFood.condition = function() {
        return (maria.goals.contains("Find food! I'm starvung!"));
    };
    getFood.action = function() {
        maria.findFood(500, maria.canEat);
        maria.addMemory("Looked for food");
        maria.makeSpeechBubble("Looking for food", 200);

        var irritable = new Production("irritable when hungry");
        eatingProduction = new Production("eating");
        eatingProduction.priority = Production.priority.High;
        eatingProduction.condition =
            function() {
                return (maria.hunger.value > 10 && maria.hunger.value < 20);
            };
        eatingProduction.action =
            function() {}



        var irrational = new Production("irrational");
        irrational.priority = Production.priority.Medium;
        irrational.condition = function() {
            return true;
            //(maria.currentMotion = Motions.spazzing || maria.emotions.current === "Angry");
        };
        irrational.action = function() {
            var randomBot = maria.getRandomBot();
            maria.faceAwayFrom(randomBot, 1000);
            maria.makeSpeechBubble("Get away from me!");
        };
    }
}

/*
Populate production list
        
this.productions = [eatingProduction, irrational];*/




/**
 * Markov process controlling emotions
 * @memberOf Maria
 */
maria.emotions = new MarkovProcess("Calm");
maria.emotions.add("Calm", [
    ["Calm", "Happy", "Angry", "Sad", "Hyper", "Sleepy"], // <-- A comma was missing
    [.1, .2, .2, .2, .2, .1]
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
/*maria.hunger.toString = function() {
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
}*/


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
    var statusString = "Emotion: " + maria.emotions.current;
    statusString += "\nMotion: " + maria.currentMotion.description;
    statusString += "\nSpeech: " + maria.speechText;
    statusString += "\n" + maria.hunger.getBar("Hunger");
    statusString += maria.goals.toString();
    statusString += maria.productionString;
    statusString += maria.getActiveMemoryString();
    return statusString;
}




/**
 * Main update called by phaser
 *
 * @memberOf Maria
 * @override
 */
maria.update = function() {
    this.currentMotion.apply(maria);
    maria.genericUpdate();
};


//React to a collision
maria.collision = function(object) {
    if (!maria.speechText.contains(object.name)) {
        maria.speechText += "Hey there " + object.name + ".";
    }
    maria.speak(object, "Hi " + object.name);
    maria.addMemory(object.name + " hit me!");
}

/*React when someone talks to me
 *@override
 */
maria.hear = function(botWhoSpokeToMe, whatTheySaid) {
    maria.speak(botWhoSpokeToMe, "Fine by me, " + botWhoSpokeToMe.name);
    maria.addMemory(botWhoSpokeToMe.name + " said \"" + whatTheySaid + "\"");
}

/**
 * React when someone highfives me
 * @override
 */
maria.highFived = function(botWhoHighFivedMe) {
    maria.speak(botWhoHighFivedMe, "Hey wassup hello " + botWhoHighFivedMe.name + ".");
    maria.addMemory(botWhoHighFivedMe.name + " high fived me!");
    maria.play(sounds.smack_forHighFive);
}

/**
 * Call this when eating
 */

maria.eatObject = function(objectToEat) {
    maria.addMemory("Ate " + objectToEat.name);
    objectToEat.eat();
    maria.hunger.subtract(objectToEat.calories);
    maria.speak(objectToEat, "Mmmmm, thanks " + objectToEat.description + ".");
    maria.play(sounds.chomp);
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
    let firedProductions = fireProductions(maria.productions);
}


//Called every 30 seconds
maria.update30Sec = function() {
    // maria.hunger.eat(51); <-- this is not a function.
}
