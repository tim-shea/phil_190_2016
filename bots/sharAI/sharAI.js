//
// INIT
//

var sharAI = new Bot(2950, 75, 'sharAI', 'bots/sharAI/sharAI.png');
sharAI.THRESHOLD_MULT = 1.5;
sharAI.DRIVE_CAP = 600;
sharAI.botRandom = 0;
sharAI.inputEnabled = true;



sharAI.init = function() {
    this.body = this.sprite.body;
    sharAI.body.rotation = 100;
    sharAI.body.speed = 100;

    game.time.events.loop(Phaser.Timer.SECOND * 1, sharAI.updatePerSec, this);

    sharAI.giggle = game.add.audio('doozer');
}

sharAI.turn = function() {
    if (Math.random() < .2) {
        sharAI.incrementAngle(sharAI.getRandom(-5, 5));
    }
}

//
// DRIVES
//

sharAI.lethargy = {
    value: 0,
    threshold: 420,
    criticalPoint: this.threshold * sharAI.THRESHOLD_MULT,
    satedPoint: this.threshold / sharAI.THRESHOLD_MULT,
    toString: function() {
        let lethargyBar = "Lethargy:   ";
        let lethargyAmount = Math.floor(sharAI.lethargy.value / 60);
        let iCount = 0;
        for (i = 0; i < lethargyAmount; i++) {
            lethargyBar += "▓"
            iCount++;
        }
        for (i = 0; i < (10 - iCount); i++) {
            lethargyBar += "░"
        }
        return lethargyBar;
    }
}

sharAI.exhaustion = {
    value: 0,
    threshold: 480,
    criticalPoint: this.threshold * sharAI.THRESHOLD_MULT,
    satedPoint: this.threshold / sharAI.THRESHOLD_MULT,
    toString: function() {
        let exhaustionBar = "Exhaustion: ";
        let exhaustionAmount = Math.floor(sharAI.exhaustion.value / 60);
        let iCount = 0;
        for (i = 0; i < exhaustionAmount; i++) {
            exhaustionBar += "▓"
            iCount++;
        }
        for (i = 0; i < (10 - exhaustionAmount); i++) {
            exhaustionBar += "░"
        }
        return exhaustionBar;
    }
}

sharAI.hunger = {
    value: 0,
    threshold: 300,
    criticalPoint: this.threshold * sharAI.THRESHOLD_MULT,
    satedPoint: this.threshold / sharAI.THRESHOLD_MULT,
    eat: function(nutrition) {
        this.value -= nutrition;
        this.value = Math.max(0, this.value); // Don't allow hunger to go below 0
    },
    toString: function() {
        let hungerBar = "Hunger:     ";
        let hungerAmount = Math.floor(sharAI.hunger.value / 60);
        let iCount = 0;
        for (i = 0; i < hungerAmount; i++) {
            hungerBar += "▓"
            iCount++;
        }
        for (i = 0; i < (10 - iCount); i++) {
            hungerBar += "░"
        }
        return hungerBar;
    }
}

sharAI.boredom = {
    value: 0,
    threshold: 180,
    criticalPoint: this.threshold * sharAI.THRESHOLD_MULT,
    satedPoint: this.threshold * sharAI.THRESHOLD_MULT,
    tickle: function() {
        sharAI.boredom.value -= 100;
        sharAI.giggle.play();
    },
    toString: function() {
        let boredomBar = "Boredom:    ";
        let boredomAmount = Math.floor(sharAI.boredom.value / 60);
        let iCount = 0;
        for (i = 0; i < boredomAmount; i++) {
            boredomBar += "▓"
            iCount++;
        }
        for (i = 0; i < (10 - iCount); i++) {
            boredomBar += "░"
        }
        return boredomBar;
    }
}

//
// MOVEMENT STATES
//

sharAI.walk = {
    name: "Walk",
    stateText: "sharAI is moving around",
    update: function() {
        sharAI.body.speed = 100;
        sharAI.turn();
    },
    adjustNeeds: function() {
        if (sharAI.lethargy.value < sharAI.DRIVE_CAP) {
            sharAI.lethargy.value++;
        }
        if (sharAI.exhaustion.value < sharAI.DRIVE_CAP) {
            sharAI.exhaustion.value++;
        }
        if (sharAI.hunger.value < sharAI.DRIVE_CAP) {
            sharAI.hunger.value++;
        }
        if (sharAI.boredom.value < sharAI.DRIVE_CAP) {
            sharAI.boredom.value++;
        }
    }
}

sharAI.stop = {
    name: "Stop",
    stateText: "sharAI is looking around.",
    update: function() {
        sharAI.body.speed = 0;
        sharAI.turn();
    },
    adjustNeeds: function() {
        if (sharAI.lethargy.value < sharAI.DRIVE_CAP) {
            sharAI.lethargy.value++;
        }
        if (sharAI.exhaustion.value > 0) {
            sharAI.exhaustion.value--;
        }
        if (sharAI.hunger.value < sharAI.DRIVE_CAP) {
            sharAI.hunger.value++;
        }
        if (sharAI.boredom.value < sharAI.DRIVE_CAP) {
            sharAI.boredom.value++;
        }
    }
}

sharAI.nap = {
    name: "Nap",
    stateText: "sharAI is napping",
    update: function() {
        sharAI.body.speed = 0;
    },
    adjustNeeds: function() {
        if (sharAI.lethargy.value > 0) {
            sharAI.lethargy.value--;
        }
        if (sharAI.exhaustion.value > 0) {
            sharAI.exhaustion.value--;
        }
        if (sharAI.hunger.value < sharAI.DRIVE_CAP) {
            sharAI.hunger.value++;
        }
        if (sharAI.boredom.value > 0) {
            sharAI.boredom.value--;
        }
    }
}

sharAI.movement = sharAI.walk;

//
// NEED STATES
//

sharAI.content = {
    name: "Content",
    getNeedMode: function() {
        if (sharAI.lethargy.value > sharAI.lethargy.threshold) { // First checks to see if sharAI is sleepy
            return sharAI.sleepy;
        //} else if (sharAI.hunger.value > sharAI.hunger.threshold) {
            //return sharAI.hungry
        } else if (sharAI.exhaustion.value > sharAI.exhaustion.threshold) { // Then checks to see if sharAI is tired
            return sharAI.tired;
        } else { // If sharAI is none of the above, then they are fine
            return sharAI.content;
        }
    },
    getMovementMode: function() {
        return sharAI.walk
    },
}

sharAI.sleepy = {
    name: "Sleepy",
    getNeedMode: function() {
        if (sharAI.lethargy.value < sharAI.lethargy.satedPoint) { // If sharAI is not sleepy anymore and ...
            if (sharAI.exhaustion.value >= sharAI.exhaustion.threshold) { // ...sharAI is tired, switch to the tired state
                return sharAI.tired;
            }
            return sharAI.content; //...sharAI is not tired, then sharAI is content
        } else { // Else, sharAI is still sleepy
            return sharAI.sleepy;
        }
    },
    getMovementMode: function() {
        return sharAI.nap;
    }
}

sharAI.tired = {
    name: "Tired",
    getNeedMode: function() {
        if (sharAI.lethargy.value >= sharAI.lethargy.criticalPoint) { // If sharAI is going to pass out from drowsiness, let them sleep
            return sharAI.sleepy;
        //} else if (sharAI.hunger.value >= sharAI.hunger.criticalPoint) {
            //return sharAI.hungry;
        } else if (sharAI.exhaustion.value < sharAI.exhaustion.satedPoint) { // If sharAI is not feeling tired anymore, then they feel fine
            return sharAI.content;
        } else { // Otherwise, sharAI still feels tired.
            return sharAI.tired
        }
    },
    getMovementMode: function() {
        return sharAI.stop;
    }
}

sharAI.need = sharAI.content;

//
// THE OTHER STUFF
//

sharAI.getStatus = function() {
    sharAI.textBox = sharAI.movement.stateText + "\n" + sharAI.hunger.toString() + "\n" + sharAI.lethargy.toString() + "\n" + sharAI.exhaustion.toString() + "\n" + sharAI.boredom.toString();
    return sharAI.textBox;
}

sharAI.update = function() {
    if (sharAI.atBoundary() === true) {
        sharAI.incrementAngle(45);
    }

    sharAI.movement = sharAI.need.getMovementMode();
    sharAI.movement.update();
    sharAI.basicUpdate();

    if (sharAI.hunger.value >= 1000) {
        sharAI.hunger.value = 0;
    }
    if (sharAI.boredom.value >= 1000) {
        sharAI.boredom.value = 0;
    }

}

sharAI.updatePerSec = function() {
    sharAI.need = sharAI.need.getNeedMode();
    sharAI.movement.adjustNeeds();
}
