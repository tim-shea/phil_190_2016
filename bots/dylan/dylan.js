var dylan = new Bot(1021, 1000, 'dylan', 'bots/dylan/player_car.png');


//getStats & init for later??
dylan.init = function() {
    this.body = this.sprite.body;
    this.body.rotation = 100;
    this.body.speed = 100;

    game.time.events.loop(Phaser.Timer.SECOND * 5, dylan.update5Sec, this);
    // game.time.events.loop(Phaser.Timer.SECOND * .5, dylan.updateHalfSec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 4, dylan.update4min, this);
    // TODO: updateHalfSec was not defined.

}
//Using units of fuel instead of hunger since I have a car
dylan.fuel = {
    amount: 0,
    fill: function(fuel_amount) {
        this.amount -= fuel_amount;
        this.amount = Math.max(0, this.amount); // Don't allow fuel to go below 0
    },
    update: function() {
        if (this.amount >= 100) {
            // Do nothing.  Fuel is capped. 
        } else {
            this.amount++;
        }
    },
    toString: function() {
        var fuelLevel = "";
        if (this.amount < 20) {
            fuelLevel = "Tank full";
        } else if (this.amount < 60) {
            fuelLevel = "Half tank";
        } else if (this.amount < 80) {
            fuelLevel = "FUEL LOW";
        } else {
            fuelLevel = "FUEL DEPLETION IMMENENT";
        }
        return fuelLevel + " (Fuel = " + this.amount + ")";
    }
}

dylan.cruising = {
    description: "cruising",
    update: function() {

        //slight increase of speed
        dylan.body.speed = 200;
    }
}

dylan.parked = {
    description: "parked",
    update: function() {

        dylan.body.speed = 0;
    }
}

dylan.speeding = {
    description: "speeding",
    update: function() {
        // Wilder steering changes
        if (Math.random() < .5) {
            dylan.incrementAngle(50 * Math.random() - 5);
        }
        // Fast
        dylan.body.speed = 575;
    }
}

dylan.reckless = {
    description: "reckless",
    update: function() {
        if (Math.random() < .6) {
            //Even more wild steering?
            dylan.incrementAngle(60 * Math.random() - 6);
        }
        //Slight speed reduction to match nervousness
        dylan.body.speed = 480;
    }
}


dylan.calm = {
    name: "Calm",
    transitionProbability: .05,
    transition: function() {
        if (Math.random() < .8) {
            return dylan.angry;
        }
        //TODO: Add somethign here too
        return dylan.calm;
    },
    getMotionMode: function() {
        if (Math.random() < .4) {
            return dylan.parked;
        }
        // TODO: Must return something here.
        return dylan.parked;
    }
}

dylan.angry = {
    name: "Angry",
    transitionProbability: .2,
    transition: function() {
        // Leave this state 70% of the time
        if (Math.random() < .7) {
            // Go to back to calm
            return dylan.calm;
        } else {
            return dylan.angry;
        }
    },
    getMotionMode: function() {
        return dylan.speeding;
    }

}
//Will add nervous emotion, issue with line 127 and missing bracket? None that I can see
/*
dylan.nervous = {
    name: "Nervous,"
    transitionProbability: .15, 
    transition: function() {
        if (Math.random() < .7) {
            return dylan.calm;
        } else {
            return dylan.nervous;
        }
    },
    getMotionMode: function() {
        return dylan.reckless;
    }
}
*/

dylan.emotion = dylan.calm;
dylan.motionMode = dylan.cruising;




dylan.getStatus = function() {
    var statusString = "Emotion: " + dylan.emotion.name;
    statusString += "\nMotion: " + dylan.motionMode.description;
    statusString += "\n" + dylan.fuel.toString();
    return statusString;
}

dylan.update = function() {
    dylan.fuel.update();
    if (dylan.atBoundary() === true) {
        dylan.incrementAngle(45);
    }

    dylan.motionMode.update();
    this.basicUpdate();

};



dylan.update5Sec = function() {
    if (Math.random() < dylan.emotion.transitionProbability) {
        dylan.emotion = dylan.emotion.transition();

    }
    dylan.motionMode = dylan.emotion.getMotionMode();
}
dylan.update4min = function() {
    dylan.fuel.fill(101);
}
