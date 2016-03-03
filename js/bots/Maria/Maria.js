var maria = new Bot(311, 1280, 'maria', 'js/bots/Maria/Maria.png');

maria.stateText = "The princess is here!";

maria.init = function() {
    maria.body = this.sprite.body;
    maria.body.rotation = 100;
    maria.body.speed = 100;

    //Initialized time updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, maria.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * .01, maria.updateTenthSec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 30, maria.update30Sec, this);
}
// Hunger 
maria.hunger = {
    amount: 0,
    eat: function(food_amount) {
        this.amount -= food_amount;
        this.amount = Math.max(0,this.amount); 
    },
    update: function() {
        if(this.amount >= 50) {
            
        } else {
            this.amount++;
        }
    },
    toString: function() {
        var hungerLevel = "";
        if (this.amount < 25) {
            hungerLevel = "Not hungry";
        } else if (this.amount < 35) {            
            hungerLevel = "Starting to get hungry";
        } else if (this.amount < 47) {            
            hungerLevel = "I'm hungry!!";
        } else {            
            hungerLevel = "I NEED FOOD!";
        }
        return hungerLevel + " (Hunger = " + this.amount + ")";
    }
}

//Id stubbornness to explore

maria.Stubborn = {
    amount: 20,
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
            hungerLevel = "Let's see who we can visit today!";
        } else if (this.amount > 15) {
            hungerLevel = "People are being pretty annoying today";
        } else if (this.amount > 2) {
            hungerLevel = "This is exactly why I don't leave my house.";
        } else {
            hungerLevel = "I hate everyone!";
        }
        return hungerLevel + " (Stubbornness = " + this.amount+ ")";
    }
}


//Motion modes
maria.dancing = {
    description: "dancing",
    update: function() {
        if (Math.random() < .5) {
            maria.incrementAngle(10 * Math.random() - 5);
        }
        maria.body.speed = 1000;
    }
}
maria.stop = {
    description: "stop",
    update: function() {
        maria.body.speed = 0;
    }
}
maria.skipping = {
    description: "skip",
    update: function() {
        if (Math.random() < .5) {
            maria.incrementAngle(50 * Math.random() - 5);
        }
        maria.body.speed = 2000;
    }
}

maria.sleep = {
    description: "sleep",
    update: function() {
        maria.body.speed = 0;
    }
}

//Emotion states

maria.happy = {
    name: "Happy",
    transitionProbability: .03,
    transition: function() {
        if (Math.random() < .3) {
            return maria.hyper;
        } else {
            return maria.sleepy;
        }
    },
    getMotionMode: function() {
        if (Math.random() < .7) {
            return maria.stop;
        } else {
            return maria.dancing;
        }
    }
}
maria.hyper = {
    name: "Hyper",
    transitionProbability: .5,
    transition: function() {
        if (Math.random() < .5) {
            return maria.happy;
        } else {
            return maria.sleepy;
        }
    },
    getMotionMode: function() {
        return maria.skipping;
    }
}
maria.sleepy = {
        name: "Sleepy",
        transitionProbability: .3,
        transition: function() {
            if (Math.random() < .6) {
                return maria.sleepy;
            } else {
                return maria.hyper;
            }
        },
        getMotionMode: function() {
            return maria.sleep;
        }
    }

//Current States
maria.emotion = maria.happy;
maria.motionMode = maria.dancing;

//(Override) Populate status field
maria.getStatus = function() {
    var statusString = "Emotion: " + maria.emotion.name;
    statusString += "\nMotion: " + maria.motionMode.description;
    statusString += "\n" + maria.hunger.toString();
    statusString += "\n" + maria.Stubborn.toString();
    return statusString;
}

//(Override) Main Update.
maria.update = function() {
    if (maria.atBoundary() === true) {
        maria.incrementAngle(45);
    }
    maria.motionMode.update();
    this.basicUpdate();
};

//Called every tenth of a second
maria.updateTenthSec = function() {
    //  No implementation
}

// Called every second
maria.update1Sec = function() {
	maria.hunger.update();
        if (Math.random() < maria.emotion.transitionProbability) {
            maria.emotion = maria.emotion.transition();
        }
        maria.motionMode = maria.emotion.getMotionMode(); 
        maria.Stubborn.update();
        if (Math.random() < maria.emotion.transitionProbability) {
            maria.emotion = maria.emotion.transition();
        } 
        maria.motionMode = maria.emotion.getMotionMode();          
    }


//Called every 30 seconds
 	maria.update30Sec = function() {
 		maria.hunger.eat(51);
        maria.Stubborn.motivation(40);
 	}
