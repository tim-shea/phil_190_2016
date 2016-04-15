var Daniel = new Bot(240, 220, 'Daniel', 'js/bots/Daniel/espeon.png');
Daniel.currentMotion = Motions.walking;
Daniel.productionString = "";

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
    this.productions.push(eatFood);

    var sleep = new Production("Sleeping");
    sleep.priority = Production.priority.Medium;
    sleep.condition = function() {
        return (Daniel.stamina.value < 25 && Daniel.satiated.value > 50);
    }
    sleep.action = function() {
        Daniel.currentMotion = Motions.stop;
        Daniel.play(sounds.snooze);
    }
    this.productions.push(sleep);
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
    this.currentMotion.apply(Daniel);
    Daniel.genericUpdate();
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
    Daniel.setMotion();
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
