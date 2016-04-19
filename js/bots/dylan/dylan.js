/**
 * Dylan's bot
 * 
 */
var dylan = new Bot(1021, 1000, 'dylan', 'js/bots/dylan/player_car.png');

/**
 * State variable
 */
dylan.currentMotion = Motions.still;
dylan.productionText = "";
dylan.stopMotion = false;

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

    this.makeProductions();
}
this.goals = new GoalSet();

dylan.canEat = function(object) {
        if (object.name !== "jerry_can") {
            return false;
        } else {
            return object.isEdible;
        }


        dylan.utilityFunction = function(object) {
            if (object instanceof Bot) {
                return 10
            } else if (object.name !== "jerry_can") {
                return -80;
            } else if (object.isEdible) {
                return object.calories;
            } else {
                return 1;
            }
        }
    }
    /**
     * Create 5 productions from list
     *
     */

dylan.makeProductions = function() {
    var authorityResponseGoal = new Production("respond to a report");
    authorityResponseGoal.priority = Production.priority.High;
    authorityResponseGoal.condition = function() {
        let d = dylan.getDistanceTo(jeff);
        if ((d > 100) && (d < 300)) {
            if (jeff.containsRecentMemory("  caressed me")) {
                return true;
            } else {
                return false;
            }
        }
    };
    authorityResponseGoal.action = function() {
        dylan.addMemory("Added goal of responding to a report");
        dylan.goals.add("Respond to report");
    }



    var insanity = new Production("insane");
    insanity.priority = Production.priority.Low;
    insanity.condition = function() {
        return (dylan.fuel.value > 90 && dylan.emotions.current === "Scared");
    };
    insanity.action = function() {
        dylan.currentMotion = Motions.spazzing;
        dylan.productionText = "WE RIDE TO VALHALLA!"
        dylan.play(sounds.attack1);
    };



    var curiosity = new Production("curious");
    curiosity.priority = Production.priority.Low;
    curiosity.condition = function() {
    /* return (dylan.goals.contains("Respond to report"));
    };
    curiosity.action = function() {
        dylan.addMemory("Was curious about something");
        dylan.makeSpeechBubble("I'm curious");
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            dylan.goals.checkIfSatisfied("Respond to report");
        }, this);
       */
        
    };
    curiosity.action = function() {
        dylan.speak(this.sprite, "What's your story?", 10);
    };

    var revenge = new Production("seeking revenge");
    revenge.priority = Production.priority.Medium;
    revenge.condition = function() {
        return (dylan.emotions.current === "Angry" && dylan.collisionCheck === true);
    };
    revenge.action = function() {
        dylan.addMemory("Seeked revenge");
        dylan.currentMotion = Motions.running;
        dylan.productionText = "Whoever that was, I AM COMING FOR YOU!"
        dylan.pursueRandomObject();
    };


    var fleeing = new Production("fleeing");
    fleeing.priority = Production.priority.High;
    fleeing.condition = function() {
        return (dylan.currentMotion = Motions.speeding && dylan.emotions.current === "Scared");
    };
    fleeing.action = function() {
        dylan.addMemory("Fled from something");
        dylan.productionText = "MUST HIDE FROM EVERYONE!"
    };


    var delerium = new Production("delerious");
    delerium.priority = Production.priority.Low;
    delerium.condition = function() {
        return (dylan.currentMotion = Motions.moping && dylan.fuel.value > 90);
    };
    delerium.action = function() {
        dylan.productionText = "Everything's going fuzzy..."
    };

    var distracted = new Production("distracted");
    distracted.priority = Production.priority.Medium;
    distracted.condition = function() {
        return (dylan.currentMotion = Motions.still);
    };
    distracted.action = function() {
        var nearbyBots = dylan.getNearbyBots(100);
        if (nearbyBots.length <= 100) {
            dylan.orientTowards(nearbyBots[100], 1000);
        }
    };

    var pester = new Production("pester");
    pester.priority = Production.priority.Low;
    pester.condition = function() {
        return (dylan.emotions.currrent === "Playful" || dylan.emotions.current === "Happy");
    };
    pester.action = function() {
        dylan.addMemory("Attempted to pester a bot");
        var randomBot = dylan.getRandomBot();
        dylan.pursue(randomBot, 500);
        dylan.makeSpeechBubble("Hey you! Come back!");
    };

    var irritated = new Production("irritated");
    irritated.priority = Production.priority.High;
    irritated.condition = function() {
        return (dylan.emotions.current === "Angry");
    };
    irritated.action = function() {
        dylan.getOverlappingBots();
        // Dylan: you need to check if the above is empty or not.
        //  set a variable to it, and then check if its length > 0
        // dylan.speak(overlappingObjects, "Get off me " + overlappingObjects.name + "!")
    };

    var randThoughts = ["I wonder what it's like having a heart",
        "What on earth is going on?!",
        "Pity. You seemed like an intelligent lifeform a few seconds ago",
        "This place is strange",
        "I'm having some emotional problems right now",
        "I've got 99 problems and you are every single one of them"
    ];

    var idletalk = new Production("idle talk");
    idletalk.priority = Production.priority.Low;
    idletalk.condition = function() {
        return dylan.emotions.current === "Calm";
        if (dylan.containsRecentMemory("Had a thought", 1.01)) {
            return false;
        } else {
            return true;
        }

        return false;
    };
    idletalk.action = function() {
        dylan.addMemory("Had a thought");
        dylan.makeSpeechBubble(randThoughts.randItem());
    };

    this.productions = [authorityResponseGoal, insanity, curiosity, revenge, fleeing, delerium, distracted, pester, irritated, idletalk];
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
    ["Angry", "Calm", "Playful"],
    [.5, .5, .5]
]);
dylan.emotions.add("Happy", [
    ["Happy", "Calm"],
    [.7, .3]
]);
dylan.emotions.add("Playful," [
    ["Playful", "Happy", "Calm"],
    [.5, .8, .6]
]);
dylan.emotions.add("Scared," [
    ["Scared", "Nervous", "Calm"],
    [.7, .7, .3]
]);
dylan.emotions.add("Nervous," [
    ["Nervous", "Scared", "Calm"],
    [.7, .5, .5]
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
        statusString += "\n" + dylan.fuel.getBar("Fuel");
        statusString += dylan.getPerceptionString();
        //statusString += dylan.goals.toString();
        statusString += dylan.getActiveMemoryString();
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
    // this.currentMotion.apply(dylan);
    // "Superclass" update method
    dylan.genericUpdate();
};



dylan.update1Sec = function() {
    dylan.updateNetwork();
    dylan.fuel.increment();
    dylan.emotions.update();
    dylan.setMotion();
    fireProductions(dylan.productions);
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
    dylan.addMemory("Saw" + object.name);
    dylan.moveAwayFrom(object);
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
        dylan.addMemory("Ate " + objectToEat.name);
        objectToEat.eat();
        dylan.fuel.subtract(objectToEat.calories);
        dylan.speak(objectToEat, "Glorious " + objectToEat.description + "!");

    }
    /**
     * Reaction to hearing something
     * @param  {bot} botWhoSpokeToMe the bot talking to this one
     * @param  {String} whatTheySaid    what they said
     * 
     */
dylan.hear = function(botWhoSpokeToMe, whatTheySaid) {
        dylan.speak(botWhoSpokeToMe, "Alright " + botWhoSpokeToMe.name); // TODO: Make more intelligent responses!
       /* if (object.name === "jeff") {
            for (goal of dylan.goals.getArray()) {
                if (goal.id.startsWith("Respond")) {
                    dylan.goals.remove(goal.id);
                }
            }
        }*/
    }
    /**
     * React when someone high fives me
     *
     * @override
     */
dylan.highFived = function(botWhoHighFivedMe) {
    dylan.addMemory("High Fived: " + object.name);
    dylan.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
}
dylan.gotIgnored = function(botWhoIgnoredMe) {
    dylan.addMemory(botWhoIgnoredMe.name + "Ignored me!");
}
