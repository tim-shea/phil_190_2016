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
    insanity = new Production("insane");
    insanity.priority = Production.priority.Low;
    insanity.condition = function() {
        return (dylan.fuel.value > 90 && dylan.emotions.current === "Scared");
    };
    insanity.action = function() {
        dylan.currentMotion = Motions.spazzing;
        dylan.productionText = "WE RIDE TO VALHALLA!"
    };



    curiosity = new Production("curious");
    curiosity.priority = Production.priority.Low;
    curiosity.condition = function() {
        return false; // <-- just forcing this production not to get triggered for now.  we can work together to reimplement this
        // dylan.emotions.current === "Happy" || dylan.emotions.current === "Playful");
        // let d = game.physics.arcade.distanceBetween(dylan.sprite, this.sprite);
        // if ((d > 100) && (d < 350)) {
        //     return true;
        // } else {
        //     return false;
        // }
    };
    curiosity.action = function() {
        dylan.speak(this.sprite, "What's your story?", 10);
    };

    revenge = new Production("seeking revenge");
    revenge.priority = Production.priority.Medium;
    revenge.condition = function() {
        return (dylan.emotions.current === "Angry" && dylan.collisionCheck === true);
    };
    revenge.action = function() {
        dylan.currentMotion = Motions.running;
        dylan.productionText = "Whoever that was, I AM COMING FOR YOU!"
        dylan.pursueRandomObject();
    };


    fleeing = new Production("fleeing");
    fleeing.priority = Production.priority.High;
        fleeing.condition = function() {
            return (dylan.currentMotion = Motions.speeding && dylan.emotions.current === "Scared");
        };
    fleeing.action = function() {
        dylan.productionText = "MUST HIDE FROM EVERYONE!"
    };

    
    delerium = new Production("delerious");
        delerium.priority = Production.priority.Low;
        delerium.condition = function() {
            return (dylan.currentMotion = Motions.moping && dylan.fuel.value > 90);
        };
        delerium.action = function() {
            dylan.productionText = "Everything's going fuzzy..."
        };

    distracted = new Production("distracted");
    distracted.priority = Production.priority.Medium; 
    distracted.condition = function() {
        return (dylan.currentMotion = Motions.still);
    };   
    distracted.action = function() {
        var nearbyBots = dylan.getNearbyBots(100);
        if (nearbyBots.length <=100) {
            dylan.orientTowards(nearbyBots[100], 1000);
        }
    };

    pester = new Production("pester");
    pester.priority = Production.priority.Low;
    pester.condition = function() {
        return (dylan.emotions.currrent === "Playful" || dylan.emotions.current === "Happy");
    };
    pester.action = function() {
        var randomBot = dylan.getRandomBot();
        dylan.pursue(randomBot, 500);
        dylan.makeSpeechBubble("Hey you! Come back!");
    };

    irritated = new Production ("irritated");
    irritated.priority = Production.priority.High;
    irritated.condition = function(){
        return (dylan.emotions.current === "Angry");
    };
    irritated.action = function() {
        dylan.getOverlappingBots();
        dylan.speak(overlappingObjects, "Get off me " + overlappingObjects.name + "!")
    };

    idletalk = new Production ("idle talk");
    idletalk.priority = Production.priority.Low;
    idletalk.condition = function() {
        return (dylan.emotions.current === "Calm");

    };
    idletalk.action = function() {
        dylan.makeSpeechBubble("I wonder what it's like having a heart");
        //I want to add several more speech bubbles with a random chance of using any one of them, not sure how yet
    };
    this.productions = [insanity, curiosity, revenge, fleeing, delerium, distracted, pester, irritated, idletalk];
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
    // this.currentMotion.apply(dylan);
    // "Superclass" update method
    dylan.genericUpdate();
};



dylan.update1Sec = function() {
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
    }
    /**
     * React when someone high fives me
     *
     * @override
     */
dylan.highFived = function(botWhoHighFivedMe) {
    dylan.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
}
