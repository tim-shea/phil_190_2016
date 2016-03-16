/**
 * A set of predefind motion patterns bots can use.
 */
var Motions = {};
Motions.still = {
    description: "still",
    apply: function(botToMove) {
        // Slight tilting when moving
        botToMove.body.speed = 0;
        botToMove.basicUpdate();
    }
}
Motions.stop = {
    description: "stopped",
    apply: function(botToMove) {
        if (Math.random() < .5) {
            botToMove.incrementAngle(10 * Math.random() - 5);

        }
        botToMove.botToMove.speed = 0;
        botToMove.basicUpdate();
    }
}
Motions.spazzing = {
    description: "spazzing",
    apply: function(botToMove) {
        // Wilder steering changes
        if (Math.random() < .5) {
            botToMove.incrementAngle(50 * Math.random() - 5);
        }
        // Fast
        botToMove.body.speed = 500;
        botToMove.basicUpdate();
    }
}
Motions.walking = {
    description: "walking",
    apply: function(botToMove) {
        // Slight tilting when moving
        if (Math.random() < .5) {
            botToMove.incrementAngle(10 * Math.random() - 5);

        }
        // A leisurely place
        botToMove.body.speed = 200;
        botToMove.basicUpdate();
    }
}
Motions.running = {
    description: "running!",
    apply: function(botToMove) {
        if (Math.random() < .5) {
            botToMove.incrementAngle(10 * Math.random() - 5);
        }
        //faster than walking
        botToMove.body.speed = 350;
        botToMove.basicUpdate();

    }
}
Motions.sonicSpeed = {
    description: "SONIC SPEED!",
    apply: function(botToMove) {
        if (Math.random() < .5) {
            botToMove.incrementAngle(10 * Math.random() - 5);
        }
        //VERY fast
        botToMove.body.speed = 700;
        botToMove.basicUpdate();

    }
}
Motions.moping = {
    description: "moping",
    apply: function(botToMove) {
        // Change angle rarely and just a bit
        if (Math.random() < .05) {
            botToMove.incrementAngle(10 * Math.random() - 5);
        }
        // Slow
        botToMove.body.speed = 50;
        botToMove.basicUpdate();
    }
}

Motions.weaving = {
    description: "weaving",
    apply: function(botToMove) {
        if (Math.random() < .5) {
            botToMove.incrementAngle(45 * Math.random() - 5)
        }
        botToMove.body.speed = 125;
        botToMove.basicUpdate();
    }
}

Motions.speeding = {
    description: "speeding",
    apply: function(botToMove) {
        if (Math.random() < .05) {
            botToMove.incrementAngle(5 * Math.random() - 5)
        }
        botToMove.body.speed = 575;
        //botToMove.basicUpdade();
    }
} 

Motions.tantrum = {
    description: "throwing a tantrum",
    apply: function(botToMove) {
        if (Math.random() < .7) {
            botToMove.incrementAngle(60 * Math.random() - 5)
        }
        botToMove.body.speed = 500;
        botToMove.basicUpdate();
    }
}

/**
 * Yang's Final Motion
 * @type {Object}
 */
Motions.zeleport = {
    description: "Zeleporting",
    apply: function(botToMove) {
        botToMove.basicupdate_disable = true;//find a way to re-enable it after the movement.
        botToMove.unstable = true;
        botToMove.temp_speed = botToMove.body.speed;//remember to restore this speed otherwise bots go berserk
        var temp_angle = Math.round( 
        game.physics.arcade.moveToXY(botToMove, 
            botToMove.body.x + Math.round(Math.random() * 10 - 5), 
            botToMove.body.y + Math.round(Math.random() * 10 - 5), 
            undefined, 7) / Math.PI * 180); //radius to angle
        //yang.text_.testFeedBack = temp_angle; // for debug
    }
}

