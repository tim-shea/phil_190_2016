var troi = new Bot(0, 2700, 'troi', 'js/bots/troi/umbreon_2.0.png');

/**
 *@author Troi Chua
 *@date February 26,2016
 */

// troi.treasure.x = 10;
// troi.treasure.y = 2930;
// troi.home.x = 25;
// troi.home.y = 2700
//
// test "Hello World!"
troi.treasure = {
    x: 10,
    y: 2930554

};
troi.home = {
    x: 25,
    y: 2700
};
///////////////////////////////
// (Override) Initialize Bot //
///////////////////////////////
troi.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed
    troi.stamina = 250000; // initial stamina

    troi.STAMINA_MAX = 20000,
        troi.STAMINA_MIN = 0;

    troi.attackList = ["Shadow Ball", "Dark Pulse", "Payback", "Toxic", "Moonlight", "Agility"];
    troi.inventory = [];
    troi.health = 100;
    troi.grimoire = [];



    //////////////////////////////
    // Initialize Timed Updates //
    //////////////////////////////
    game.time.events.loop(Phaser.Timer.SECOND * 10, troi.update10Sec, this); //main loop (1/sec) for status
    game.time.events.loop(Phaser.Timer.SECOND * .1, troi.updateTenthSec, this); //loops (10/sec) for updating the stamina
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, troi.update_1_30_sec, this); //loops every 2 minutes to update for hunger



    this.makeProductions();

    ///////////////////////////////////////
    // edibitlity function initization// //
    ///////////////////////////////////////
    troi.safeFood = function(object) {
        if (object.name == "jerry_can" || object.name == "diet_pepsi" || object.name == "devil_fruit_rubber" || object.name == "steak") {
            return false;
        } else {
            return object.isEdible;
        }
    }

    /////////////////////////////////////
    // utility function initialization //
    /////////////////////////////////////
    troi.utility = function(object) {
        if (object instanceof Bot) {
            return 15;
        } else if (object.name == "sharAI") {
            return -65;
        } else if (object.name == "jeff") {
            return 0;
        } else if (object.name == "web") {
            return -20;
        } else if (object.name == "easternCastle") {
            return 69;
        } else if (object.name == "treasure") {
            return 88;
        } else if (object.name == "Cherry Blossom Tree") {
            return 30;
        } else if (object.isEdible) {
            if (object.calories <= 100) {
                return object.calories;
            } else {
                var temp = object.calories;
                while (temp > 100) {
                    temp = temp - temp / 2;
                }
                return temp;
            }
        } else if (!object.isEdible) {
            return -35;
        } else {
            return 5;
        }
    }
}
troi.motionMode = Motions.still;
troi.extraText = "";



/////////////////
// Productions //
/////////////////
troi.makeProductions = function() {
    var treasureHunting = new Production("Treasure hunting");
    treasureHunting.priority = Production.priority.Medium;
    treasureHunting.condition = function() {
        return (
            troi.hunger.amount < 300 &&
            troi.stamina > 12000 &&
            (troi.emotion.current === "neutral" ||
                troi.emotion.current === "happy" ||
                troi.emotion.current === "euphoric")
            /* && (world.time > sunrise && world.time < sunset) */
        );
    };
    treasureHunting.action = function() {
        troi.body.speed = 150; //&&
        troi.goto(troi.treasure.x, troi.treasure.y, 3000);
        troi.addMemory("Searched for treasure.");
    };
    var homeward = new Production("To Home");
    homeward.priority = Production.priority.High;
    homeward.condition = function() {
        return (!troi.home &&
            troi.stamina > 100 &&
            troi.hunger.amount < 400
        );
    };
    homeward.action = function() {
        troi.goto(troi.home.x, troi.home.y, 2000);
        troi.body.speed = 100;
        troi.addMemory("The journey home...");
    };

    var nap = new Production("Naptime");
    nap.priority = Production.priority.Low;
    nap.condition = function() {
        return (
            (troi.stamina > 0 && troi.stamina < 500) &&
            (troi.hunger.amount > 200 && troi.hunger.amount < 400) &&
            troi.emotion.current === "neutral"
        );
    };
    nap.action = function() {
        troi.resting;
        troi.extraText = "Naptime";
        troi.play(sounds.snooze);
        troi.addMemory("Took a nap.");
    };
    var eating = new Production("Eating");
    eating.priority = Production.priority.High;
    eating.condition = function() {
        return (
            troi.hunger.amount > 400
        );
    }
    eating.action = function() {
        troi.extraText = "Foooooooooooooood.";
        troi.findFood(700, troi.safeFood);
        troi.play(sounds.chomp);
        troi.addMemory("Starving, time to procure food.");
    };
    var tinkering = new Production("Tinkering");
    tinkering.priority = Production.priority.Medium;
    tinkering.condition = function() {
        return (
            (troi.emotion.current === "euphoric" || troi.emotion.current === "happy") &&
            (troi.stamina > 3000 && troi.stamina < 15000) &&
            troi.hunger.amount < 200
        );
    };
    tinkering.action = function() {

        for (i = 0; i < troi.inventory.length; i++) {
            if (Math.random > .5 && troi.inventory[i] == 0) {
                troi.inventory[i] += 1;
            };
        };
        troi.addMemory("Tinkered with stuff");

    };

    var flee = new Production("Flee");
    flee.priorit = Production.priority.High;
    flee.condition = function() {
        return (
            troi.health < 20 ||
            (troi.emotion.current === "agitated" || troi.emotion.current === "neutral") &&
            troi.hunger.amount < 300 &&
            Math.random < 0.23
        );
    };
    flee.action = function() {
        troi.moveAwayFrom(troi.utility(troi.getNearbyBots(200)));
        troi.makeSpeechBubble("Run, run away!    TxT   ", 2500);
        troi.addMemory("Fled from threat.");
    };

    var tailing = new Production("Sneak-tailing");
    tailing.priority = Production.priority.Medium;
    tailing.condition = function() {
        return (
            troi.health > 55 &&
            (troi.emotion.current === "agitated" || troi.emotion.current === "neutral" || troi.emotion.current === "happy") &&
            troi.stamina > 12000 &&
            troi.hunger.amount < 300
        );
    };
    tailing.action = function() {
        var localBots = troi.getNearbyBots(500);
        if (localBots.length > 0) {
            troi.body.speed = 75;
            troi.pursue(localBots[0], 20000);
            troi.makeSpeechBubble("* que MGS OST ", 6315);
            troi.addMemory("Tailed somebody.");
        }

    };

    var politicking = new Production("Political answering");
    politicking.priority = Production.priority.Medium;
    politicking.condition = function() {
        var localBots = troi.getNearbyBots(1000);
        for (var i = 0; i < localBots.length; i++) {
            if (localBots[i].name === "jeff") {
                return (
                    (troi.emotion.current === "neutral" || troi.emotion.current === "happy") &&
                    troi.hunger.amount < 200 &&
                    troi.stamina > 4321
                )
            }

        }
    };
    politicking.action = function() {
        var localBots = troi.getNearbyBots(1000);
        troi.orientTowards(localBots, 1000);
        troi.pursue(localBots, 25000);
        troi.speak(localBots, "Politically correct statements", 7000)
    };

    var research = new Production("Research");
    research.priority = Production.priority.Low;
    research.condition = function() {
        return (!(troi.emotion.current === "angry" || troi.emotion.current === "agitated") &&
            troi.hunger.amount < 250 &&
            troi.stamina > 2100
        );
    };
    research.action = function() {
        var localObj = troi.getNearbyObjects(1000);
        if (localObj.length > 0) {

            for (var i = 0; i < localObj.length; i++) {
                localObj[i] = localObj.name;
            }

        }

    };


    this.productions = [treasureHunting, homeward, nap, eating, tinkering,
        flee, tailing, politicking, research
    ];

};


///////////////////
// Emotion Modes //
///////////////////
troi.emotion = new MarkovProcess("neutral");
troi.emotion.add("neutral", [
    ["neutral", "angry", "agitated", "happy", "euphoric"],
    [0.75, 0.025, 0.10, 0.10, 0.025]
]);
troi.emotion.add("happy", [
    ["happy", "euphoric", "neutral", "agitated"],
    [0.65, 0.25, 0.075, .025]
]);
troi.emotion.add("agitated", [
    ["agitated", "neutral", "angry", "happy"],
    [0.65, 0.25, 0.075, 0.025]
]);
troi.emotion.add("euphoric", [
    ["euphoric", "happy", "neutral", "angry"],
    [0.549, 0.30, 0.15, 0.001]
]);
troi.emotion.add("angry", [
    ["angry", "agitated", "neutral"],
    [0.349, 0.45, 0.20, 0.001]
]);
//////////////////
// Motion modes //
//////////////////

troi.setMotion = function() {
    if (troi.motionMode.current === Motions.walking) {
        troi.stamina -= 10;
        if (troi.stamina <= 100) { //Pass stamina threshold
            return troi.exhausted;
        } else {
            if (Math.random() <= .20) {
                if (Math.random() <= .10) { //Probability of being startled
                    if (Math.random() > .20) { //Probability of running away
                        //  console.log('Run, Run Away!');
                        return Motions.running;
                    } else { //Probably of freezing in fear
                        return troi.resting;
                    }
                } else { // Probability of choosing to transition states
                    if (Math.random() <= .50) { //Probability of choosing to sprint 
                        return Motions.running;
                    } else { //Probability of resting
                        return troi.resting;
                    }
                    return Motions.walking;
                }

            }

        }
    }

    if (troi.motionMode.current === Motions.running) {
        troi.stamina -= 50;
        if (troi.stamina <= 100) {
            return troi.exhausted; //become exhauseted when stamina level is low
        } else {
            if (Math.random() < 0.15) {
                return Motions.walking;
            } else {
                return Motions.running;
            }
        }

    }


}

//////////////////////
// Personal motions //
//////////////////////


troi.resting = {
    description: "Resting",
    transitionProbability: .30, //Probability of transition states
    transition: function() {
        if (troi.stamina > 200) {
            return troi.walking; //resume walking
        } else {
            return troi.resting;
        }
    },
    update: function() {
        // Standing still
        troi.body.speed = 0;
        troi.stamina += 700; //energy recharging while walking
    }
}

troi.exhausted = { //penalty for not watching stamina
    description: "Exhausted",
    transition: function() {
        if (troi.stamina <= 0) {
            return troi.recovering;
        }
    },
    update: function() {
        // Slow
        troi.body.speed -= 5;
        troi.stamina -= 10; //catching breath and panting, so stamina still goes down
    }
}
troi.recovering = {
    description: "Recovering", //intermediate recovery stage before true resting state; cannot transit into any other state than rest
    transition: function() {
        if (troi.stamina >= 20) {
            return troi.resting;
        }
    },
    update: function() {
        troi.body.speed = 0;
        troi.stamina += 20;
    }
}


/////////////
// Hunger  //
/////////////

troi.hunger = {
    amount: 0,
    eat: function(food_amount) {
        this.amount -= food_amount; //this. refers to specific class
        this.amount = Math.max(0, this.amount); // Don't allow hunger to go below 0

    },
    update: function() {
        if (this.amount >= 500) {
            this.amount = 500;
            // Do nothing.  Hunger is capped. 
        } else {
            this.amount += 10;
        }
    },
    toString: function() {
        var hungerLevel = ""; // initializer

        if (this.amount < 100) {
            hungerLevel = "Happy";
            //troi.emotion = troi.happy; //well fed = happy Umbreon
            troi.stamina--;
        } else if (this.amount < 300) {
            hungerLevel = "Hungrwe";
            //troi.emotion = troi.neutral;
            troi.stamina -= 2;
        } else if (this.amount < 400) {
            hungerLevel = "Huuuungrweeeeeeeee!!"; //hunger causes energy to decrease faster
            troi.stamina -= 3;
            //troi.emotion = troi.agitated; //upset from hunger
        } else {
            hungerLevel = "FOOOOOOOOOOOOOOOOOD Pweeeeeaaaaseeeeee!";
            troi.stamina -= 5;
            //troi.emotion = troi.neutral; //to hungry to be angry
        }
        return hungerLevel + " (Hunger = " + this.amount + ")";
    }

}

///////////////////////////////////////
// Id state - entertainment/amusment //
///////////////////////////////////////
troi.amuse = {
    time: 500,
    play: function(play_time) {
        this.time += play_time; //increases playtime
        this.time = Math.min(this.time, 0);

    },
    update: function() {
        if (this.time <= 0) {
            troi.emotion.current = "agitated"; //0 playtime = upset troi

        } else {
            this.time -= 5; //time spent playing
        }
    },
    toString: function() {
        var amuse_level = ""; //initializer

        if (this.time >= 250) {
            amuse_level = "WOOOOOOOOOOOOOT!";
            //troi.emotion = troi.euphoric; //#// code currently stands as responsible for crashing
            troi.stamina -= 5; //playtime takes energy
        } else if (this.time >= 100) {
            amuse_level = "YAAAY!!!";
            //troi.emotion = troi.happy;
            troi.stamina -= 3;
        } else if (this.time >= 50) {
            amuse_level = "...awe...";
            //troi.emotion = troi.neutral;
            troi.stamina--;
        } else {
            amuse_level = "Sooooooooooooooooooooooooo Boooooooooooooooooooooooooooooooooored.";
            //troi.emotion = troi.agitated; //Boredom is painful
        }
        return amuse_level + " (Amusement Level = " + this.time + ")";
    }
}


///////////////////
// status update //
///////////////////
troi.getStatus = function() {
    var statusString = troi.emotion.current;
    statusString += "\n-------";
    statusString += "\nMotion mode: " + troi.motionMode.description + "\nEmotion mode: " + troi.emotion.current;
    statusString += "\nStamina : " + troi.stamina + "\n" + troi.hunger.toString() + "\n" + troi.amuse.toString();
    return statusString;
}

/////////////////////////////////////////////////////////////////////////////////////
// (Override) Main update.  On my machine this is called about 43 times per second //
/////////////////////////////////////////////////////////////////////////////////////
troi.update = function() {
    if (troi.atBoundary() === true) {
        troi.incrementAngle(45);
    }
    this.basicUpdate();


    troi.genericUpdate();
};

////////////////////////////////////
// Called every tenth of a second //
// updates stamina                //
////////////////////////////////////
troi.updateTenthSec = function() {
    if (troi.stamina <= 0) {
        troi.motionMode = troi.resting;
        troi.stamina = troi.STAMINA_MIN;
    } else if (troi.motionMode != troi.resting && troi.stamina <= 400) {
        troi.motionMode = troi.exhausted;
    }
    if (troi.stamina >= troi.STAMINA_MAX) {
        troi.stamina = troi.STAMINA_MAX;
    }

}


/////////////////////////
// Called every second //
//updates status       //
/////////////////////////
troi.update10Sec = function() {

    troi.setMotion();
    troi.amuse.update();
    troi.hunger.update();
    // fireProductions(troi.productions);

}
troi.update_1_30_sec = function() {
    //troi.hunger.eat(501); //food for troi
    //troi.amuse.play(500); //playtime increment
    troi.stamina = troi.STAMINA_MAX;
}

/**
 * collisions
 * 
 * @param  {entity} object [may be food, may not be]
 */
troi.collision = function(object) {
    // console.log("Object is edible: " + object.isEdible);
    troi.addMemory("Observed " + object.name);
    if (object.isEdible) {
        if (troi.hunger.amount > 100) {
            troi.eatObject(object);
        }
    } else {
        troi.speak(object, "Hello " + object.name);
    }
}

/**
 * eatObject
 * @param  {[entity]} objectToEat [food]
 *
 */
troi.eatObject = function(objectToEat) {
    troi.addMemory("Ate " + objectToEat.name);
    objectToEat.eat();
    troi.hunger.eat(objectToEat.calories);
    troi.speak(objectToEat, "Yay, food. " + objectToEat.description + "!");
    troi.play(sounds.chomp);
    
}

troi.hear = function(botWhoSpokeToMe, whatTheySaid) {
    troi.speak(botWhoSpokeToMe, "...Sure " + botWhoSpokeToMe.name); // TODO: Make more intelligent responses!
}

troi.highFive = function(botToHighFive) {
    if (botToHighFive instanceof Bot) {
        if (game.physics.arcade.distanceBetween(this.sprite, botToHighFive.sprite) < 100) {
            botToHighFive.highFived(this);
        }
    }
}

troi.highFived = function(botWhoHighFivedMe) {
    troi.addMemory("High Fived: " + object.name);
    troi.speak(botWhoHighFivedMe, "Yo, wasuuuup? " + botWhoHighFivedMe.name + ".");
}

troi.ignore = function(annoyingBot) {
    troi.addMemory("\'Walk away slowly an ignore the wierdo.\'" + object.names);
    this.incrementAngle(180);
    this.body.speed = 250;
}
