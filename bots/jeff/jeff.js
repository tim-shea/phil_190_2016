var jeff = new Bot(540, 520, 'jeff', 'bots/jeff/person.png');

// (Override) Initialize Bot
jeff.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 100; // Initial Speed

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, jeff.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * .01, jeff.updateTenthSec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60*2, jeff.update2min, this);
}

// Hunger 
jeff.hunger = {
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
}

//
// Motion modes
//
jeff.walking = {
    description: "walking",
    update: function() {
        // Slight tilting when moving
        if (Math.random() < .5) {
            jeff.incrementAngle(10 * Math.random() - 5);

        }
        // A leisurely place
        jeff.body.speed = 200;
    }
}
jeff.still = {
    description: "still",
    update: function() {
        // Stand still
        jeff.body.speed = 0;
    }
}
jeff.spazzing = {
    description: "spazzing",
    update: function() {
        // Wilder steering changes
        if (Math.random() < .5) {
            jeff.incrementAngle(50 * Math.random() - 5);
        }
        // Fast
        jeff.body.speed = 500;
    }
}
jeff.moping = {
    description: "moping",
    update: function() {
        // Change angle rarely and just a bit
        if (Math.random() < .05) {
            jeff.incrementAngle(10 * Math.random() - 5);
        }
        // Slow
        jeff.body.speed = 50;
    }
}

//
// Emotion states
//
jeff.calm = {
    name: "Calm",
    transitionProbability: .05,
    transition: function() {
        if (Math.random() < .8) {
            return jeff.happy;
        } else {
            return jeff.angry;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .4) {
            return jeff.still;
        } else {
            return jeff.moping;
        }
    }
}
jeff.angry = {
    name: "Angry",
    transitionProbability: .2,
    transition: function() {
        // Leave this state 80% of the time
        if (Math.random() < .8) {
            // If exiting, go to back to calm
            return jeff.calm;
        } else {
            return jeff.angry;
        }
    },
    getMotionMode: function() {
        return jeff.spazzing;
    }

}
jeff.happy = {
    name: "Happy",
    transitionProbability: .01,
    transition: function() {
        if (Math.random() < .8) {
            return jeff.calm;
        } else {
            return jeff.angry;
        }
    },
    getMotionMode: function() {
        // When happy, either walk or spaz
        if (Math.random() < .8) {
            return jeff.walking;
        } else {
            return jeff.spazzing;
        }
    }
}
jeff.sad = {
    name: "Sad",
    transitionProbability: .3,
    transition: function() {
        if (Math.random() < .8) {
            return jeff.calm;
        } else {
            return jeff.angry;
        }
    },
    getMotionMode: function() {
        return jeff.moping;
    }
}

// Current States
jeff.emotion = jeff.calm;
jeff.motionMode = jeff.walking;

// (Override) Populate status field
jeff.getStatus = function() {
    var statusString = "Emotion: " + jeff.emotion.name;
    statusString += "\nMotion: " + jeff.motionMode.description;
    statusString += "\n" + jeff.hunger.toString();
    return statusString;
}

// (Override) Main update.  On my machine this is called about 43 times per second
jeff.update = function() {
    if (jeff.atBoundary() === true) {
        jeff.incrementAngle(45);
    }
    jeff.motionMode.update(); // Todo: IncrementAngle does not work when called from timed functions.  Not sure why not.
    this.basicUpdate();
};

// Called every tenth of a second
jeff.updateTenthSec = function() {
    //  No implementation
}

// Called every second
jeff.update1Sec = function() {
    jeff.hunger.update();
    if (Math.random() < jeff.emotion.transitionProbability) {
        jeff.emotion = jeff.emotion.transition();
    }
    jeff.motionMode = jeff.emotion.getMotionMode();
}

// Called every two minutes
jeff.update2min = function() {
    jeff.hunger.eat(101);
}