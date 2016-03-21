var faust = new Bot(300, 300, 'faust', 'js/bots/faust/faust.png');

faust.speechText = "";

faust.init = function() {
    this.body = this.sprite.body;
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed
    //faust.energy = 100 // Initial energy level
    game.time.events.loop(Phaser.Timer.SECOND * 1, faust.update1Sec, this);
};

faust.turn = function() {
	faust.turnRandom = Math.random();
	if (faust.turnRandom < .1) { // small left turn
		faust.incrementAngle(5);
	} else if (faust.turnRandom >= .1 && faust.turnRandom < .2) { // small right turn
		faust.incrementAngle(-5)
	}
};

// Hunger 
faust.hunger = {
    amount: 0,
    eat: function(food_amount) {
        this.amount -= food_amount;
        this.amount = Math.max(0,this.amount); // Don't allow hunger to go below 0
    },
    update: function() {
        if(this.amount >= 100) {
            // Do nothing.  Hunger is capped. 
        } else {
            this.amount++;
        }
    },
    toString: function() {
        var hungerLevel = "";
        if (this.amount < 20) {
            hungerLevel = "Not hungry";
        } else if (this.amount < 60) {            
            hungerLevel = "Hungry";
        } else if (this.amount < 80) {            
            hungerLevel = "Starving!!";
        } else {            
            hungerLevel = "FEED ME!";
        }
        return hungerLevel + " (Hunger = " + this.amount + ")";
    }
};


//
//Stats
//

/*
faust.energy = {
	amount: 100,
	max: 150,
	min: 0,
	rest: function(need_energy) {
		this.amount = need_energy;
		this.amount = Math.min(0, this.amount); //max energy is 100 and can't go below 0
	},
	update: function() {
		if(this.amount = 100) {
			// fine. energy is capped.
		} else {
			this.amount--;
		}
	},
	toString: function() {
		var energyLevel = "";
		if (this.amount >= 70) {
			energyLevel = "fit as a fiddle";	
		} else if (this.amount < 70) {
			enrgyLevel = "losing energy";
		} else if (this.amount < 30) {
			energyLevel = "Running low on energy!!";
		} else if (this.amount < 10) {
			energyLevel = "NEED REST!!";
		} else if (this.amount = 0) {
			faust.energy = faust.still
		}
		return enrgyLevel + " (Energy = " + this.amount + ")";
	},
}*/

//
// Motion states
//

faust.setMotion = function() {

    // Default markov chain movement patterns
    // TODO: Add conditions that involve hunger, etc.
    if (faust.emotions.current === "Sad") {
        faust.currentMotion = Motions.moping;
    } else if (faust.emotions.current === "Happy") {
        faust.currentMotion = Motions.walking;
    } else if (faust.emotions.current === "Calm") {
        let rnd = Math.random();
        if (rnd < .5) {
            faust.currentMotion = Motions.still;
        } else {
            faust.currentMotion = Motions.walking;
        }
    } else if (faust.emotions.current === "Angry") {
        faust.currentMotion = Motions.spazzing;
    }
}

/*
faust.walk = {
    description: "walking",
    update: function() {
    	if (Math.random() < .5) {
            faust.incrementAngle(10 * Math.random() - 5);
        }
        faust.body.speed = 100;
    },
    //adjustNeeds: function() {
    //	faust.energy.amount++;
    //}
};

faust.run = {
	description: "running!",
	update: function() {
		if (Math.random() < .5) {
			faust.incrementAngle(10 * Math.random() - 5);
		}
		faust.body.speed = 200;
	},
	//adjustNeeds: function() {
	//	faust.energy.amount -=5;
	//}
};

faust.sonicSpeed = {
	description: "SONIC SPEED!",
	update: function() {
		if (Math.random() < .5) {
			faust.incrementAngle(10 * Math.random() - 5);
		}
		faust.body.speed = 500;
	},
	//adjustNeeds: function() {
	//	faust.energy.amount -=10
	//}
};

faust.still = {
    description: "still",
    update: function() {
        faust.body.speed = 0;
    },
    //adjustNeeds: function() {
    //	faust.energy.amount += 10;
    //}
};

faust.moping = {
    description: "moping",
    update: function() {
        if (Math.random() < .05) {
            faust.incrementAngle(10 * Math.random() - 5);
        }
        faust.body.speed = 50;
    }
};
*/

//
// Emotion States
//

/**
 * Markov process controlling emotions
 */
faust.emotions = new MarkovProcess("Calm");
faust.emotions.add("Calm", [
    ["Calm", "Happy", "Angry", "Sad"],
    [.8, .1, .05, .05]
]);
faust.emotions.add("Sad", [
    ["Sad", "Calm"],
    [.7, .3]
]);
faust.emotions.add("Angry", [
    ["Angry", "Calm"],
    [.5, .5]
]);
faust.emotions.add("Happy", [
    ["Happy", "Calm"],
    [.7, .3]
]);

// old code
/*
 faust.calm = {
    name: "Calm",
    transitionProbability: .05,
    transition: function() {
        if (Math.random() < .8) {
            return faust.happy;
        } else {
            return faust.angry;
        }
    },
    getMotionState: function() {
        if (Math.random() < .4) {
            return faust.still;
        } else {
            return faust.moping;
        }
    }
};

faust.angry = {
    name: "Angry",
    transitionProbability: .2,
    transition: function() {
        // Leave this state 80% of the time
        if (Math.random() < .8) {
            // If exiting, go to back to calm
            return faust.calm;
        } else {
            return faust.angry;
        }
    },
    getMotionState: function() {
        return faust.sonicSpeed;
    }

};

faust.happy = {
    name: "Happy",
    transitionProbability: .01,
    transition: function() {
        if (Math.random() < .8) {
            return faust.calm;
        } else {
            return faust.angry;
        }
    },
    getMotionState: function() {
        // When happy, either walk or spaz
        if (Math.random() < .8) {
            return faust.run;
        } else {
            return faust.sonicSpeed;
        }
    }
};

faust.sad = {
    name: "Sad",
    transitionProbability: .3,
    transition: function() {
        if (Math.random() < .8) {
            return faust.calm;
        } else {
            return faust.angry;
        }
    },
    getMotionState: function() {
        return faust.moping;
    }
};
*/

//
// Other Stuff
//

// Current States
faust.motionState = faust.walk;
faust.emotions = faust.calm; 

// (Override) Populate status field
faust.getStatus = function() {
    var statusString = "Emotion: " + faust.emotions.name;
    statusString += "\nMotion: " + faust.motionState.description;
    statusString += "\n" + faust.hunger.toString();
    statusString += "\nSpeech: " + faust.speechText;
    return statusString;
};

faust.update = function() {
    if (faust.atBoundary() === true) {
        faust.incrementAngle(45);
    };
    faust.motionState.update(); 
    this.basicUpdate();
    faust.genericUpdate(); //"Superclass" update method, can override the collision status
};

faust.collision = function(object) {
    // console.log("Object is edible: " + object.isEdible);
    if (object.isEdible) {
        faust.eatObject(object);
    } else {
        faust.speak(object, "Hello " + object.name);
    }
    // faust.flee(object);
    // faust.pursue(object);
};

//speak vs hear -----> speak is bot and hear is the override of speak in my specific bot
faust.hear = function(botWhoSpokeToMe, whatTheySaid) {
	faust.speak(botWhoSpokeToMe, "Right on " + botWhoSpokeToMe.name); // TODO: Make more intelligent responses!
    /*if (!faust.speechText.contains("Oh you")) {
        faust.speechText += " Oh you just said " + whatTheySaid + ".";
    }*/
};

faust.highFived = function(botWhoHighFivedMe) {
    faust.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
};

faust.update1Sec = function() {
	faust.hunger.update();
    if (Math.random() < faust.emotions.transitionProbability) {
        faust.emotions = faust.emotions.transition();
    };
    faust.motionState = faust.emotions.getMotionState();
    faust.hunger.eat(101);
    faust.speechText = "";
};







