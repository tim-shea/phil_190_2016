//
// INIT
//

var sharAI = new Bot(750, 750, 'sharAI', 'bots/sharAI/sharAI.png');
sharAI.turnRandom = 0;
sharAI.needLimit = 2;

sharAI.lethargy = {
    value: 0,
    threshold: 300,
    criticalPoint: this.threshold * sharAI.needLimit
}

sharAI.exhaustion = {
    value: 0,
    threshold: 180,
    criticalPoint: this.threshold * sharAI.needLimit
}

sharAI.init = function() {
    this.body = this.sprite.body;
    sharAI.body.rotation = 100;
    sharAI.body.speed = 100;
    game.time.events.loop(Phaser.Timer.SECOND * 1, sharAI.updatePerSec, this);
}

sharAI.turn = function() {
    sharAI.turnRandom = Math.random();
    if (sharAI.turnRandom < .1) { // Small left turn
        sharAI.incrementAngle(5);
    } else if (sharAI.turnRandom >= .1 && sharAI.turnRandom < .2) { // Small right turn
        sharAI.incrementAngle(-5);
    }
}

//
// MOVEMENT STATES
//

sharAI.walk = {
    name: "Walk",
    stateText: " and is going for a walk.",
    update: function() {
        sharAI.body.speed = 100;
        sharAI.turn();
    },
    adjustNeeds: function() {
        sharAI.lethargy.value++;
        sharAI.exhaustion.value++;
    }
}

sharAI.stop = {
    name: "Stop",
    stateText: " and is sitting down.",
    update: function() {
        sharAI.body.speed = 0;
        sharAI.turn();
    },
    adjustNeeds: function() {
        sharAI.lethargy.value++;
        sharAI.exhaustion.value--;
    }
}

sharAI.sprint = {
    name: "Sprint",
    stateText: " and is running.",
    update: function() {
        sharAI.body.speeed = 200;
        sharAI.turn();
    },
    adjustNeeds: function() {
        sharAI.lethargy.value++;
        sharAI.exhaustion.value -= 3;
    }
}

sharAI.nap = {
    name: "Nap",
    stateText: " and is taking a nap.",
    update: function() {
        sharAI.body.speed = 0;
    },
    adjustNeeds: function() {
        sharAI.lethargy.value--;
        sharAI.exhaustion.value--;
    }
}

sharAI.movement = sharAI.walk;

//
// NEED STATES
//

sharAI.content = {
    name: "Content",
    stateText: "sharAI is feeling fine",
    getNeedMode: function() {
        if (sharAI.lethargy.value > sharAI.lethargy.threshold) { // First checks to see if sharAI is sleepy
            return sharAI.sleepy;
        } else if (sharAI.exhaustion.value > sharAI.exhaustion.threshold) { // Then checks to see if sharAI is tired
            return sharAI.tired;
        } else { // If sharAI is none of the above, then they are fine
            return sharAI.content;
        }
    },
    getMovementMode: function() {
        return sharAI.walk
    }
}

sharAI.sleepy = {
    name: "Sleepy",
    stateText: "sharAI is too drowsy to stay awake",
    getNeedMode: function() {
        if (sharAI.lethargy.value == 0) { // If sharAI is not sleepy anymore and ...
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
    stateText: "sharAI needs to take a break",
    getNeedMode: function() {
        if (sharAI.lethargy.value >= sharAI.lethargy.criticalPoint) { // If sharAI is going to pass out from drowsiness, let them sleep
            return sharAI.sleepy;
        } else if (sharAI.exhaustion.value == 0) { // If sharAI is not feeling tired anymore, then they feel fine
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
    sharAI.textBox = (sharAI.need.stateText + sharAI.movement.stateText);
    return sharAI.textBox;
}

sharAI.update = function() {
    if (sharAI.atBoundary() === true) {
        sharAI.incrementAngle(45);
    }
    sharAI.movement = sharAI.need.getMovementMode();
    sharAI.movement.update();
    sharAI.basicUpdate();
}

sharAI.updatePerSec = function() {
    sharAI.need = sharAI.need.getNeedMode();
    sharAI.movement.adjustNeeds();
}
