//add var 

var duyen = new Bot(75, 1800, 'duyen', 'js/bots/duyen/duyen.png');
duyen.angle = 90;
duyen.speed = 100;

duyen.stateText = "just flowing around";
duyen.speechText = "";
duyen.currentlyPursuing = "Nothing";
duyen.stopMotion = false;

duyen.init = function() {
    this.body = this.sprite.body;
    duyen.body.rotation = 50;
    duyen.body.speed = 50;

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, duyen.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 10, duyen.updateTenSecs, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, duyen.update2min, this);

    // Make productions
    this.makeProductions();

    //Create the gol set
    this.goals = new GoalSet();

    // Setting up edibility function

    duyen.canEat = function(object) {
        if (object.name == "jerry_can" || object.name == "Spice_Poffin" || object.name == "Devil_Fruit_rubber") {
            return false;
        } else {
            return object.isEdible;
        }
    }

    // Setting up utility function
    duyen.utilityFunction = function(object) {
        if (object instanceof Bot) {
            return 10;
        } else if (object.name == "jerry_can") {
            return -80;
        } else if (object.name == "Spice_Poffin") {
            return -30;
        } else if (object.name == "Devil_Fruit_rubber") {
            return -70;
        } else if (object.isEdible) {
            return object.calories;
        } else {
            return 1;
        }
    }

}

// Creating productions

duyen.makeProductions = function() {

    this.productions = [];

    // Make going home a goal
    var goHomeGoal = new Production("go home when mad");
    goHomeGoal.priority = Production.priority.Medium;
    goHomeGoal.condition = function() {
        return (duyen.emotions.current === "mad");
    };
    goHomeGoal.action = function() {
        duyen.addMemory("add goal of going home when mad");
        duyen.goals.add("go home, avoid distractions");
        duyen.makeSpeechBubble("Don't talk to me", 75);
    };
    this.productions.push(goHomeGoal);

    // Act on goal
    var goHome = new Production("back to base");
    goHome.priority = Production.priority.Medium;
    goHome.condition = function() {
        return (duyen.goals.contains("go home"));
    };
    goHome.action = function() {
        duyen.goHome(duyen.orientToward = pinkTree);
        duyen.addMemory("went home");
        duyen.makeSpeechBubble("going home", 75);
    };
    this.productions.push(goHome);


    var eatingProduction = new Production("eating");
    eatingProduction.priority = Production.priority.High;
    eatingProduction.condition = function() {
        return (
            duyen.hunger.value > 70 &&
            duyen.emotions.current === "mad");
    };
    eatingProduction.action = function() {
        duyen.currentMotion = Motions.tanturm;
        duyen.extraText = "I'm hungry!";
    };
    var cleaningProduction = new Production("cleaning");
    cleaningProduction.priority = Production.priority.Medium;
    cleaningProduction.condition = function() {
        return (
            duyen.hygiene.value > 30 &&
            duyen.emotions.current === "sad");
    };
    cleaningProduction.action = function() {
        duyen.extraText = "I feel yucky";
    };

    var attackEnemy = new Production("attack");
    attackEnemy.priority = Production.priority.Medium;
    attackEnemy.condition = function() {
        return true; /*(duyen.hunger.value > 70 &&
            duyen.emotions.current === "mad" &&
            duyen.hunger.value > 20);*/
    };
    attackEnemy.action = function() {
        duyen.currentMotion = Motions.attack;
        duyen.extraText = "Lets duel!";
        duyen.attackNearbyBots();
        duyen.play(sounds.attack1);
    };
    attackEnemy.probNotFiring = .98;
    if(!duyen.stopMotion) {
        this.productions.push(attackEnemy);
    }

    var fleeAway = new Production("flee");
    fleeAway.priority = Production.priority.High;
    fleeAway.condition = function() {
        return (
            duyen.emotions.current === "sad");
    };
    fleeAway.action = function() {
        duyen.currentMotion = Motions.flying;
        duyen.extraText = "I'm outta here!";
    };
    var dancingProduction = new Production("dancing");
    dancingProduction.priority = Production.priority.Low;
    dancingProduction.condition = function() {
        return (
            duyen.emotions.current === "happy" &&
            duyen.hunger.value > 30);
    };
    dancingProduction.action = function() {
        duyen.currentMotion = Motions.dancing;
    };
    dancingProduction.probNotFiring = .9;
    if(!duyen.stopMotion) {
        this.productions.push(dancingProduction);
    }

    // New productions
    var makeFriendGoal = new Production("make a new friend");
    makeFriendGoal.priority = Production.priority.Low;
    makeFriendGoal.condition = function() {
        return (duyen.emotions.current = "happy");
    };
    makeFriendGoal.action = function() {
        duyen.addMemory("Remember new friend's name");
        duyen.goals.add("New friend");
    };
    this.productions.push(makeFriendGoal);

    var makeFriend = new Production("make a new friend");
    makeFriend.priority = Production.priority.Low;
    makeFriend.condition = function() {
        return (duyen.goals.contains("Friend's name"));
    };
    makeFriend.action = function() {
        duyen.makeFriend(botWhoSpokeToMe);
        duyen.containsMemory("Friend's name");
        duyen.makeSpeechBubble("It was nice meeting you" + botWhoSpokeToMe.name);
    };
    this.productions.push(makeFriend);
   
    // Make finding food a goal
    var findFoodGoal = new Production("find food");
    findFoodGoal.priority = Production.priority.High;
    findFoodGoal.condition = function() {
        return (duyen.hunger.value > 60);
    };
    findFoodGoal.action = function() {
        duyen.addMemory("Added goal of finding food");
        duyen.goals.add("Find food");
    };
    this.productions.push(findFoodGoal);

    // Act on the food goal
    var findFood = new Production("find food");
    findFood.priority = Production.priority.High;
    findFood.condition = function() {
        return (duyen.goals.contains("Find food"));
    };
    findFood.action = function() {
        duyen.findFood(500, duyen.canEat);
        duyen.addMemory("Looked for food");
        duyen.makeSpeechBubble("Looking for food", 200);
        /*duyen.currentMotion = Motions.flying;
        duyen.productionText = "I need food!";
        duyen.getRandomObject;
        duyen.getNearbyObjects;*/
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            duyen.goals.checkIfSatisfied("Find food");
        }, this);
    };
    this.productions.push(findFood);

    var defendResources = new Production("sleeping");
    defendResources.priority = Production.priority.Medium,
        defendResources.condition = function() {
            return (
                duyen.emotions.current === "mad");
        };
    defendResources.action = function() {
        duyen.attackMotion;
        duyen.ProductionText = "Back off!";
        duyen.attackNearbyBots;
    };

    // this.productions = [eatingProduction, cleaningProduction, attackEnemy, fleeAway, dancingProduction, goHome, makeFriend, findFood, defendResources];
}


duyen.emotions = new MarkovProcess("calm");
duyen.emotions.add("calm", [
    ["calm", "happy", "mad", "sad"],
    [.7, .2, .05, .05]
]);
duyen.emotions.add("happy", [
    ["happy", "calm"],
    [.7, .3]
]);
duyen.emotions.add("mad", [
    ["mad", "calm", "sad"],
    [.7, .1, .2]
]);
duyen.emotions.add("sad", [
    ["sad", "calm", "mad"],
    [.6, .2, .2]
]);


// Hunger 
duyen.hunger = new DecayVariable(0, 1, 0, 100);
duyen.hunger.toString = function() {
    var hungerLevel = "";
    if (this.amount < 30) {
        hungerLevel = "Full";
    } else if (this.amount < 70) {
        hungerLevel = "Hungry";
    } else if (this.amount < 85) {
        hungerLevel = "Starving";
    } else {
        hungerLevel = "Feed Me!";
    }

    return hungerLevel + " (Hunger = " + this.value + ")";
}

//Hygiene
duyen.hygiene = new DecayVariable(0, 1, 0, 100);
duyen.hygiene.toString = function() {
    var hygieneLevel = "";
    if (this.amount < 40) {
        hygieneLevel = "Clean";
    } else if (this.amount < 85) {
        hygieneLevel = "Dirty";
    } else {
        hygieneLevel = "Filthy";
    }
    return hygieneLevel + " (Dirtiness = " + this.value + ")";
}

// (Override) Populate status field
duyen.getStatus = function() {
    // var statusString = "Emotion: " + duyen.emotion.name;
    // statusString += "\nMotion: " + duyen.motionMode.description;
    var statusString = duyen.hunger.toString();
    statusString += duyen.hygiene.toString();
    statusString += "\nMoving to: " + duyen.currentlyPursuing;
    statusString += "\nSpeech: " + duyen.speechText;
    statusString += duyen.goals.toString();
    statusString += duyen.getActiveMemoryString();
    return statusString;
}


duyen.setMotion = function() {
    if (duyen.emotions.current === "happy") {
        duyen.currentMotion = Motions.flying;
    } else if (duyen.emotions.current === "sad") {
        duyen.currentMotion = Motions.floating;
    } else if (duyen.emotions.current === "mad") {
        duyen.currentMotion = Motions.attack;
    } else if (duyen.emotions.current === "calm") {
        let rnd = Math.random();
        if (rnd < .5) {
            duyen.currentMotion = Motions.still;
        } else {
            duyen.currentMotion = Motions.floating;
        }
    }
}

duyen.update = function() {
    if(!duyen.stopMotion) {
        duyen.currentMotion.apply(duyen);
        duyen.genericUpdate();
    }
};

duyen.update = function() {
    duyen.genericUpdate();
};


// Called every second
duyen.update1Sec = function() {
    duyen.speechText = "";
    duyen.updateNetwork();
    duyen.hunger.increment();
    duyen.hygiene.increment();
    duyen.setMotion();
    fireProductions(duyen.productions);
    //duyen.findFood(duyen.edibility);
    // <<<<<<< HEAD
    //     duyen.hunger.increment();
    // =======
    // duyen.hunger.update();
    // duyen.hygiene.update();
    //     // if (Math.random() < duyen.emotion.transitionProbability) {
    //     //     duyen.emotion = duyen.emotion.transition();
    //     // }
    //     // duyen.motionMode = duyen.emotion.getMotionMode();
    // >>>>>>> origin/master
}

duyen.updateTenSecs = function() {}

duyen.update2min = function() {}


duyen.collision = function(object) {
    duyen.addMemory("Just ran into " + object.name);
    if (!duyen.speechText.contains(object.name)) {
        duyen.speechText += "Hello " + object.name + ".";
    }
    if(object instanceof Bot) {
        duyen.speak(object, "Hello " + object.name);        
    }
    // duyen.flee(object);
    // duyen.pursue(object);
    duyen.addMemory("Saw " + object.name);
    duyen.moveAwayFrom(object);
    if (duyen.canEat(object)) {
        duyen.eatObject(object);
    }
}

duyen.hear = function(botWhoSpokeToMe, whatTheySaid) {
    //duyen.hear = botWhoSpokeToMe.name + " says: " + whatTheySaid; <- Danger!  This overrwrites bot.hear
    duyen.addMemory(botWhoSpokeToMe.name + " said " + whatTheySaid);
    if (!duyen.speechText.contains("Oh you")) {
        duyen.speechText += " Oh you just said " + whatTheySaid + ".";
    }
}

duyen.highFived = function(botWhoHighFivedMe) {
    duyen.addMemory(botToHighFive + " highfived");
    duyen.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
    duyen.goals.remove("Get High Fived");
}

duyen.eatObject = function(objectToEat) {
    duyen.addMemory("Ate" + objectToEat.name);
    objectToEat.eat();
    duyen.hunger.subtract(objectToEat.calories);
    duyen.play(sounds.chomp);
    /*    objectToEat.eat();
        duyen.hunger.eatIt(objectToEat.calories);
        duyen.speak(objectToEat, "Yummy " + objectToEat.description + "!");
        sound.chomp.play();*/
    duyen.goals.remove("Find food");

duyen.gotCrushed = function(botThatIsCrushing) {
    duyen.addMemory(botThatIsCrushingMe.name + ", you're on top of me!");
    var reportViolenceGoal = "Report " + botThatIsCrushingMe.name + " to authorities!";
    if (botThatIsCrushingMe.name=="rei" || botThatIsCrushingMe.name=="jeff" || botThatIsCrushingMe.name=="yang") {
        jeff.makeSpeechBubble("That hurts!");
    } else {
        duyen.goals.add(reportViolenceGoal);
    }

    var reportViolence = new Production("report violence");
    reportViolence.priority = Production.priority.High;
    reportViolence.condition = function() {
        return (duyen.goals.contains(reportViolenceGoal));
    };
    reportViolence.action = function() {
        duyen.purse(dylan)
        duyen.speak(dylan, "Reporting a case of violent squishing");
        game.time.event.add(Phaser.Timer.SECOND * 3, function() {
            duyen.goals.checkIfSatisfied(reportViolenceGoal);
        }, this);
    };
    this.productions.push(reportViolence);
};
}