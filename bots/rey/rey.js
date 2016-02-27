var rey = new Bot(1200, 1200, 'rey', 'bots/rey/whitedeer.png');

// (Override) Initialize Bot
rey.init = function() {
        this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
        this.body.rotation = 100; // Initial Angle
        this.body.speed = 100; // Initial Speed

        // Initialize Timed Updates
        game.time.events.loop(Phaser.Timer.SECOND * 1, rey.update1Sec, this);
        game.time.events.loop(Phaser.Timer.SECOND * 60, rey.update1min, this);
    }
    //
    // Id Hunger
    //
rey.hunger = {
        amount: 0,
        eat: function(food_amount) {
            this.amount -= food_amount;
            this.amount = Math.max(0, this.amount);
        },
        update: function() {
            if (this.amount >= 40) {
                // Do nothing.  Hunger is capped. 
            } else {
                this.amount++;
            }
        },
        toString: function() {
            var hungerLevel = "";
            if (this.amount < 15) {
                hungerLevel = "Not hungry!";
            } else if (this.amount < 25) {
                hungerLevel = "I'm getting pretty hungry..";
            } else if (this.amount < 38) {
                hungerLevel = "Okay, now I'm hungry..";
            } else {
                hungerLevel = "FEED ME NOW!";
            }
            return hungerLevel + " (Hunger = " + this.amount + ")";
        }
    }
    //
    //Id Curiousity to explore 
    //
rey.Curiousity = {
    amount: 40,
    motivation: function(motivation_amount) {
        this.amount -= motivation_amount;
        this.amount = Math.max(0, this.amount);
    },
    update: function() {
        if (this.amount <= 0) {} else {
            this.amount--;
        }
    },
    toString: function() {
        var motivationLevel = "";
        if (this.amount > 25) {
            hungerLevel = "I want to explore the world!";
        } else if (this.amount > 15) {
            hungerLevel = "On second thought, the world is too big...";
        } else if (this.amount > 2) {
            hungerLevel = "I'm also getting tired..";
        } else {
            hungerLevel = "Okay I'm done exploring for a while until I can get food again.";
        }
        return hungerLevel + " (Curiousity = " + this.amount + ")";
    }
}

// Motion modes
//
rey.walking = {
    description: "Walking",
    update: function() {
        // Slight tilting when moving
        if (Math.random() < .5) {
            rey.incrementAngle(10 * Math.random() - 5);

        }
        // A leisurely place
        rey.body.speed = 200;
        // console.log("Someone join me!!!!");

    }
}
rey.still = {
    description: "Still",
    update: function() {
        // Stand still
        rey.body.speed = 0;
        // console.log("Taking a break!");
    }
}
rey.dancing = {
    description: "Dancing",
    update: function() {
        // Wilder steering changes
        if (Math.random() < .5) {
            rey.incrementAngle(50 * Math.random() - 5);
        }
        // Fast
        rey.body.speed = 1000;
        // console.log("Dun Dun Dun Dun");
    }
}


//
// Emotion states
//
rey.energized = {
    name: "energized",
    transitionProbability: .5,
    transition: function() {
        if (Math.random() < .4) {
            return rey.energized;
        } else {
            return rey.exhausted;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .33) {
            return rey.walking;
        } else {
            return rey.dancing;
        }
    }
}
rey.exhausted = {
    name: "exhausted",
    transitionProbability: .2,
    transition: function() {
        // Leave this state 80% of the time
        if (Math.random() < .7) {
            // If exiting, go to back to energized
            return rey.energized;
        } else {
            return rey.exhausted;
        }
    },
    getMotionMode: function() {
        return rey.still;
    }

}

// Current States
rey.emotion = rey.energized;
rey.motionMode = rey.walking;

// (Override) Populate status field motionMode.description
rey.getStatus = function() {
    var statusString = rey.motionMode.description;
    statusString += " because I am ";
    statusString += rey.emotion.name;
    statusString += ".";
    statusString += "\n" + rey.hunger.toString();
    statusString += "\n" + rey.Curiousity.toString();
    return statusString;
}

rey.update = function() {
    if (rey.atBoundary() === true) {
        rey.incrementAngle(45);
    }
    rey.motionMode.update();
    this.basicUpdate();
};

rey.update1Sec = function() {
    if (Math.random() < rey.emotion.transitionProbability) {
        rey.emotion = rey.emotion.transition();
    }
    rey.motionMode = rey.emotion.getMotionMode();
}
rey.update1Sec = function() {
    rey.hunger.update();
    if (Math.random() < rey.emotion.transitionProbability) {
        rey.emotion = rey.emotion.transition();
    }
    rey.motionMode = rey.emotion.getMotionMode();
    rey.Curiousity.update();
    if (Math.random() < rey.emotion.transitionProbability) {
        rey.emotion = rey.emotion.transition();
    }
    rey.motionMode = rey.emotion.getMotionMode();
}

// Called every one minutes
rey.update1min = function() {
        rey.hunger.eat(41);
    }
    // rey.update1Sec = function() {


// Called every one minutes
// rey.update1min = function() {
// rey.Curiousity.motivation(41);
// }
