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
Motions.sonicSpeed = {
    description: "SONIC SPEED!",
    apply: function(botToMove) {
        if (Math.random() < .5) {
            botToMove.incrementAngle(10 * Math.random() - 5);
        }
        //very fast
        botToMove.body.speed = 500;
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
