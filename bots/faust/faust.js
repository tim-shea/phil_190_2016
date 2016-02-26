var faust = new Bot(240, 220, 'faust', 'bots/faust/faust.png');

faust.init = function() {
    this.body = this.sprite.body;
    faust.body.rotation = 100; // Initial Angle
    faust.body.speed = 100; // Initial Speed
    //faust.energy = 100 // Initial energy level
    game.time.events.loop(Phaser.Timer.SECOND * 1, faust.update1Sec, this);
}

faust.turn = function() {
	faust.turnRandom = Math.random();
	if (faust.turnRandom < .1) { // small left turn
		faust.incrementAngle(5);
	} else if (faust.turnRandom >= .1 && faust.turnRandom < .2) { // small right turn
		faust.incrementAngle(-5)
	}
}

//
//Stats
//

faust.energy = {
	amount: 100,
	max: 150,
	min: 0,
	/*--rest: function(need_energy) {
		this.amount = need_energy;
		this.amount = Math.min(0, this.amount); //max energy is 100 and can't go below 0
	},
	update: function() {
		if(this.amount = 100) {
			// fine. energy is capped.
		} else {
			this.amount--;
		}
	},*/
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
}

//
// Motion states
//

faust.walk = {
    description: "walk",
    update: function() {
        faust.body.speed = 100;
        faust.turn();
    },
    adjustNeeds: function() {
    	faust.energy.amount++;
    }
}

faust.run = {
	description: "running!",
	update: function() {
		faust.body.speed = 200;
		faust.turn();
	},
	adjustNeeds: function() {
		faust.energy.amount -=5;
	}
}

faust.sonicSpeed = {
	description: "SONIC SPEED!",
	update: function() {
		faust.body.speed = 500;
		faust.turn();
	},
	adjustNeeds: function() {
		faust.energy.amount -=10
	}
}

faust.still = {
    description: "still",
    update: function() {
        faust.body.speed = 0;
    },
    adjustNeeds: function() {
    	faust.energy.amount += 10;
    }
}

//
// Emotion States
//

faust.calm = {
	name: "Calm",
	transitionProbability: .05,
}

//
// Other Stuff
//

// Current States
faust.movement = faust.walk;
faust.emotion = faust.calm; 

// (Override) Populate status field
faust.getStatus = function() {
    var statusString = faust.movement.description;
    statusString += "\n-------";
    statusString += "\nMotion mode: " + faust.movement.description;
    return statusString;
}

faust.update = function() {
    if (faust.atBoundary() === true) {
        faust.incrementAngle(45);
    }
    faust.movement.update(); 
    this.basicUpdate();
}

faust.update1Sec = function() {
	// faust.emotion.update(); // TODO: Emotions not fully implemented yet
	faust.movement.update();
}

/*faust.getStatus = function() {
    return faust.stateText;
}

faust.update = function() {
    if (Math.random() < .05) {
        faust.incrementAngle(10);
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            faust.body.speed = 500;
            faust.stateText = "Normal";
        } else {
            faust.body.speed = 0;
            faust.stateText = "Backwards";
        }
    }
    faust.basicUpdate();
};*/









