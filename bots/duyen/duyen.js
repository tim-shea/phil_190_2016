var duyen = new Bot(150, 150, 'duyen', 'bots/duyen/duyen.png');
	
duyen.angle = 90;
duyen.speed = 100;

duyen.stateText = "just flowing around";

duyen.init = function() {
	this.body = this.sprite.body;
	duyen.body.rotation = 50;
	duyen.body.speed = 50;

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, duyen.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * .01, duyen.updateTenthSec, this);
}

//
// Motion modes
//
duyen.floating = {
    description: "floating",
    update: function() {
        // Slight tilting when moving
        if (Math.random() < .5) {
            duyen.incrementAngle(10 * Math.random() - 5);

        }
        // A leisurely place
        duyen.body.speed = 75;
    }
}
duyen.stop = {
    description: "resting",
    update: function() {
        // Stand stop
        duyen.body.speed = 0;
    }
}
duyen.flying = {
    description: "flying",
    update: function() {
        // Change angle rarely and just a bit
        if (Math.random() < .5) {
            duyen.incrementAngle(10 * Math.random() - 5);
        }
        // Slow
        duyen.body.speed = 250;
    }
}

//
// Hunger states
//
duyen.full = {
    name: "full",
    transitionProbability: .05,
    transition: function() {
        if (Math.random() < .8) {
            return duyen.full;
        } else {
            return duyen.hungry;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .8) {
            return duyen.floating;
        } else {
            return duyen.stop;
        }
    }
}
duyen.starving = {
    name: "starving",
    transitionProbability: .2,
    transition: function() {
        // Leave this state 80% of the time
        if (Math.random() < .8) {
            // If exiting, go to back to full
            return duyen.full;
        } else {
            return duyen.starving;
        }
    },
    getMotionMode: function() {
        return duyen.flying;
    }

}
duyen.hungry = {
    name: "hungry",
    transitionProbability: .3,
    transition: function() {
        if (Math.random() < .8) {
            return duyen.full;
        } else {
            return duyen.starving;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .4) {
            return duyen.floating;
        } else {
            return duyen.flying;
        }
    }
}

// Current States
duyen.hunger = duyen.full;
duyen.motionMode = duyen.floating;

// (Override) Populate status field
duyen.getStatus = function() {
    var statusString = duyen.hunger.name;
    statusString += "\n-------";
    statusString += "\nMotion mode: " + duyen.motionMode.description;
    return statusString;
}

// (Override) Main update.  On my machine this is called about 43 times per second
duyen.update = function() {
    if (duyen.atBoundary() === true) {
        duyen.incrementAngle(25);
    }
    duyen.motionMode.update(); // Todo: IncrementAngle does not work when called from timed functions.  Not sure why not.
    this.basicUpdate();
};

// Called every tenth of a second
duyen.updateTenthSec = function() {
    //  No implementation
}

// Called every second
duyen.update1Sec = function() {
    if (Math.random() < duyen.hunger.transitionProbability) {
        duyen.hunger = duyen.hunger.transition();
    }
    duyen.motionMode = duyen.hunger.getMotionMode();
}




// }

// duyen.timedEvend = function() {
//     console.log(game.time.totalElapsedSeconds());   
//     }

// duyen.getStatus = function() {
//  	return duyen.stateText;
// }

// duyen.update = function() {
//  	if (Math.random() < .1) {
//  		duyen.angle +=5;
//  		duyen.angle = duyen.angle % 120; 
//  }
	
// if (Math.random() < 0.1) {
// 	if (Math.random() < 0.05) {
// 			duyen.speed = 10;
//  		}
//  		else {
//  			duyen.speed = 100;
//  		}
//  	}

//  	duyen.basicUpdate();
//  };