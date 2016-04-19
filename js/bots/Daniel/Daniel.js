var Daniel = new Bot(240, 220, 'Daniel', 'js/bots/Daniel/espeon.png');
Daniel.currentMotion = Motions.walking;
Daniel.productionString = "";
Daniel.stopMotion = false;
Daniel.botPursuit = "";
Daniel.vacation = "";

Daniel.init = function() {
    this.body = this.sprite.body;
    this.body.angle = 100; // Initial Angle
    this.body.speed = 0; // Initial Speed
    this.makeProductions();
    this.goals = new GoalSet();
    //this.sprite.scale.setTo(3,3);
    // ^ this is how you scale things.  Use this for the shield.
    //Initialized timed events
    game.time.events.loop(Phaser.Timer.SECOND * 1, Daniel.updateOneSecond, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60, Daniel.updateMin, this);
}

Daniel.canEat = function(object) {
    if (object.name == "jerry_can") {
        return false;
    } else {
        return object.isEdible;
    }
}

Daniel.utilityFunction = function(object) {
    if (object instanceof Bot) {
        return 30;
    } else if (object.name == "jerry_can") {
        return -90;
    } else if (object.name == "steak") {
        return 15;
    } else if (object.isEdible) {
        return object.calories;
    } else {
        return 0;
    }
}

//
//Decay Variables
//

Daniel.satiated = new DecayVariable(50, 1, 0, 100);
Daniel.stamina = new DecayVariable(95, 1, 0, 100);

//
// Productions! (finally)
//

Daniel.makeProductions = function() {

    this.productions = [];

    var eatFood = new Production("Look for food");
    eatFood.priority = Production.priority.High;
    eatFood.condition = function() {
        return (Daniel.satiated.value < 40);
    }
    eatFood.action = function() {
        Daniel.findFood(500, Daniel.canEat);
    }
    if (!Daniel.stopMotion) {
        this.productions.push(eatFood);
    }

    var sleep = new Production("Sleeping");
    sleep.priority = Production.priority.High;
    sleep.condition = function() {
        return (Daniel.stamina.value < 25 && Daniel.satiated.value > 50);
    }
    sleep.action = function() {
        Daniel.currentMotion = Motions.stop;
        Daniel.play(sounds.snooze);
    }
    this.productions.push(sleep);

    var boredomRoulette = new Production("Decide what to do");
    boredomRoulette.priority = Production.priority.Low;
    boredomRoulette.condition = function() {
        return (Daniel.satiated.value > 50 && Daniel.stamina.value > 50);
    }
    boredomRoulette.action = function() {
        var roulette = Math.random();
        if (roulette > .5) {
            Daniel.goals.add("Make a new friend");
            Daniel.botPursuit = Daniel.getRandomBot();
        } else {
            Daniel.goals.add("Travel to distant lands");
            Daniel.vacation = Daniel.getRandomObject();
        }
    }
    boredomRoulette.probNotFiring = .9;
    //if (Daniel.goals.contains("Make a new friend!") || Daniel.goals.contains("Travel to distant lands!")) {} else {
        this.productions.push(boredomRoulette);
    //}

    var tourism = new Production("Visiting " + Daniel.vacation);
    tourism.priority = Production.priority.Low;
    tourism.condition = function() {
        return (Daniel.goals.contains("Travel to distant lands"));
    }
    tourism.action = function() {
        if (Daniel.containsRecentMemory("Saw " + Daniel.vacation.name, 1.5)) {
            Daniel.goals.remove("Travel to distant lands");
            Daniel.vacation = "";
        } else {
            Daniel.pursue(Daniel.vacation, 750);
            Daniel.makeSpeechBubble("Headed towards " + Daniel.vacation.name);
            game.time.events.add(Phaser.Timer.SECOND * 3, function() {
                Daniel.goals.checkIfSatisfied("Travel to distant lands");
            }, this);
        }
    }
    //tourism.probNotFiring = .5;
    if (!Daniel.stopMotion) {
        this.productions.push(tourism);
    }

    var friendMaking = new Production("Greeting " + Daniel.botPursuit);
    friendMaking.priority = Production.priority.Low;
    friendMaking.condition = function() {
        return (Daniel.goals.contains("Make a new friend"));
    }
    friendMaking.action = function() {
        if (Daniel.containsRecentMemory("Saw " + Daniel.botPursuit.name, 1.5)) {
            Daniel.goals.remove("Make a new friend")
            Daniel.botPursuit = "";
        } else {
            Daniel.pursue(Daniel.botPursuit, 750);
            Daniel.makeSpeechBubble("Saying hello to " + Daniel.botPursuit.name);
            game.time.events.add(Phaser.Timer.SECOND * 3, function() {
                Daniel.goals.checkIfSatisfied("Make a new friend");
            }, this);
        }
    }
    //friendMaking.probNotFiring = .5;
    if (!Daniel.stopMotion) {
        this.productions.push(friendMaking);
    }
}

//
// Mental States
//

Daniel.emotion = new MarkovProcess("Chill");
Daniel.emotion.add("Chill", [
    ["Chill", "Enthusiastic", "Apathetic", "Irate"],
    [.8, .1, .05, .05]
]);
Daniel.emotion.add("Enthusiastic", [
    ["Chill", "Enthusiastic", "Apathetic", "Irate"],
    [.3, .5, .1, .1]
]);
Daniel.emotion.add("Apathetic", [
    ["Chill", "Enthusiastic", "Apathetic", "Irate"],
    [.2, .05, .6, .15]
]);
Daniel.emotion.add("Irate", [
    ["Chill", "Enthusiastic", "Apathetic", "Irate"],
    [.1, .25, .25, .4]
]);

Daniel.setMotion = function() {
    if (Daniel.emotion.current === "Chill") {
        if (Math.random < .5) {
            Daniel.currentMotion = Motions.still;
            //Daniel.addMemory("Stayed still");
        } else {
            Daniel.currentMotion = Motions.walking;
            //Daniel.addMemory("Walked");

        }
    } else if (Daniel.emotion.current === "Enthusiastic") {
        if (Math.random < .95) {
            Daniel.currentMotion = Motions.running;
            //Daniel.addMemory("Ran");
        } else {
            Daniel.currentMotion = Motions.sonicSpeed;
            //Daniel.addMemory("Ran really fast");

        }
    } else if (Daniel.emotion.current === "Apathetic") {
        if (Math.random < .6) {
            Daniel.currentMotion = Motions.moping;
            //Daniel.addMemory("Moped");

        } else {
            Daniel.currentMotion = Motions.stop;
            //Daniel.addMemory("Stopped");

        }
    } else if (Daniel.emotion.current === "Irate") {
        if (Math.random < .7) {
            Daniel.currentMotion = Motions.running;
            //Daniel.addMemory("Ran");

        } else {
            Daniel.currentMotion = Motions.tantrum;
            //Daniel.addMemory("Threw a tantrum");

        }
    }
}

Daniel.getStatus = function() {
    var statusString = "Emotional State: " + Daniel.emotion.current;
    statusString += "\n>------<";
    statusString += "\nMotion type: " + Daniel.currentMotion.description;
    statusString += "\n" + Daniel.satiated.getBar("Hunger 	");
    statusString += "\n" + Daniel.stamina.getBar("Stamina 	");
    statusString += Daniel.goals.toString();
    statusString += Daniel.productionString;
    return statusString;
}

Daniel.update = function() {
    if (!Daniel.stopMotion) {
        this.currentMotion.apply(Daniel);
        Daniel.genericUpdate();
    }
    if (Daniel.botPursuit.name == "Daniel") {
        Daniel.botPursuit = "";
        Daniel.goals.remove("Make a new friend")
    }
};

Daniel.updateOneSecond = function() {
    Daniel.updateNetwork();
    Daniel.satiated.decrement();
    if (Daniel.satiated > 50) {
        Daniel.stamina.increment();
    } else if (Daniel.productionString == "Sleeping") {
        Daniel.stamina.increment();
        Daniel.stamina.increment();
    } else {
        Daniel.stamina.decrement();
    }
    Daniel.emotion.update();
    if (!Daniel.stopMotion) {
        //Daniel.setMotion();
    }
    let firedProductions = fireProductions(Daniel.productions);
    Daniel.productionString = getProductionString(firedProductions);
}

Daniel.updateMin = function() {
    // Daniel.hunger.eatIt(75);
}

Daniel.collision = function(object) {
    Daniel.addMemory("Saw " + object.name);
    if (Daniel.canEat(object)) {
        Daniel.eatObject(object);
    } else {
        Daniel.moveAwayFrom(object);
        // var soundSelector = Daniel.getRandom(0, 3);
        // console.log("soundselector " +soundSelector);
        // if (soundSelector <= 1) {
        //     console.log("2");
        //     Daniel.play(sounds.collision_noise3);
        // } else if (soundSelector > 1 && soundSelector <= 2) {
        //     console.log("3");
        //     Daniel.play(sounds.collision_noise4);
        // } else if (soundSelector > 2) {
        //     console.log("4");
        //     Daniel.play(sounds.collision_noise5);
        // }
    }
}

Daniel.eatObject = function(objectToEat) {
    objectToEat.eat();
    Daniel.satiated.add(objectToEat.calories);
    Daniel.speak(objectToEat, "Delicious " + objectToEat.description + "!");
    Daniel.play(sounds.chomp);
}
