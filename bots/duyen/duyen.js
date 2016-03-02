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
  	game.time.events.loop(Phaser.Timer.SECOND * 60*2, duyen.update2min, this);
 	game.time.events.loop(Phaser.Timer.SECOND * 60*3, duyen.update3min, this);
}

// Hunger 
duyen.hunger = {
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
        if (this.amount < 30) {
            hungerLevel = "Full";
        } else if (this.amount < 70) {            
            hungerLevel = "Hungry";
        } else if (this.amount < 85) {            
            hungerLevel = "Starving";
        } else {            
            hungerLevel = "Feed Me!";
        }
        return hungerLevel + " (Hunger = " + this.amount + ")";
    }
}

//Hygiene
duyen.hygiene = {
    amount: 0,
    clean: function(clean_amount) {
        this.amount -= clean_amount;
        this.amount = Math.max(0,this.amount); // There's a limit to being dirty
    },
    update: function() {
        if(this.amount >= 100) {
            // Do nothing.  hygiene is capped. 
        } else {
            this.amount++;
        }
    },
    toString: function() {
        var hygieneLevel = "";
        if (this.amount < 40) {
            hygieneLevel = "Clean";
        } else if (this.amount < 85) {            
            hygieneLevel = "Dirty";
        } else {            
            hygieneLevel = "Filthy";
        }
        return hygieneLevel + " (Dirtiness = " + this.amount + ")";
    }
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
// Emotion states
//
duyen.happy = {
    name: "happy",
    transitionProbability: .05,
    transition: function() {
        if (Math.random() < .8) {
            return duyen.happy;
        } else {
            return duyen.sad;
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
duyen.mad = {
    name: "mad",
    transitionProbability: .2,
    transition: function() {
        // Leave this state 80% of the time
        if (Math.random() < .8) {
            return duyen.happy;
        } else {
            return duyen.mad;
        }
    },
    getMotionMode: function() {
        return duyen.flying;
    }

}
duyen.sad = {
    name: "sad",
    transitionProbability: .3,
    transition: function() {
        if (Math.random() < .8) {
            return duyen.happy;
        } else {
            return duyen.mad;
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
duyen.emotion = duyen.happy;
duyen.motionMode = duyen.floating;

// (Override) Populate status field
duyen.getStatus = function() {
    var statusString = "Emotion: " + duyen.emotion.name;
    statusString += "\nMotion: " + duyen.motionMode.description;
    statusString += "\n " + duyen.hunger.toString();
    statusString += "\n " + duyen.hygiene.toString();
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
console.log("moving");
    //  No implementation
}

// Called every second
duyen.update1Sec = function() {
duyen.hunger.update();
duyen.hygiene.update();
    if (Math.random() < duyen.emotion.transitionProbability) {
        duyen.emotion = duyen.emotion.transition();
    }
    duyen.motionMode = duyen.emotion.getMotionMode();
}

// Called every two minutes
duyen.update2min = function() {
duyen.hunger.eat(101);
}

// Called every three minutes
duyen.update3min = function() {
duyen.hygiene.clean(101);
}



// }

// duyen.timedEvend = function() {
//     console.log(game.time.totalElapsedSeconds());   
//     }

// duyen.getStatus = function() {
//   return duyen.stateText;
// }

// duyen.update = function() {
//   if (Math.random() < .1) {
//   duyen.angle +=5;
//   duyen.angle = duyen.angle % 120; 
//  }
// if (Math.random() < 0.1) {
// if (Math.random() < 0.05) {
// duyen.speed = 10;
//   }
//   else {
//   duyen.speed = 100;
//   }
//   }

//   duyen.basicUpdate();
//  };
