var rey = new Bot(240, 220, 'rey', 'bots/rey/whitedeer.png');
// rey.body.angle = 100; // Initial Angle
// rey.body.speed = 100; // Initial Speed
// rey.body.rotation = 100; 


rey.stateText = "Beware the break-dancing mighty deer!"; //break-dancing mighty deer because everytime it stops to rest it moves like crazy

rey.init = function() {
        this.body = this.sprite.body; // Todo:  a way to automate this?
        rey.body.rotation = 100; // Initial Angle
        rey.body.speed = 100; // Initial Speed
        // Do something every n seconds.


        //game.time.events.loop(Phaser.Timer.SECOND * 1, rey.timedEvend, this);
        //game.time.events.loop(Phaser.Timer.SECOND * 1, rey.update1Sec, this);
        game.time.events.loop(Phaser.Timer.SECOND * 5, rey.updateFiveSec, this);

    }
    //
    ///Motion Code
    //
rey.walking = {
    description: "walking",
    update: function() {
        // Slight tilting when moving
        if (Math.random() < .5) {
            rey.incrementAngle(10 * Math.random() - 5);

        }
        // A leisurely place
        rey.body.speed = 200;
    }
}
rey.still = {
    description: "still",
    update: function() {
        // Stand still
        rey.body.speed = 100;
        rey.body.rotation = 10;
    }
}

//
//Emotion Code
//
// rey.angry = {
//         name: "Angry",
//         transitionProbability: .2,
//         transition: function() {
//             // Leave this state 80% of the time
//             if (Math.random() < .8) {
//                 // If exiting, go to back to calm
//                 return rey.calm;
//             } else {
//                 return rey.angry;
//             }
//         },
//         getMotionMode: function() {
//             return rey.spazzing;
//         }

//     }
    //
    //current state
    //
rey.emotion = rey.calm;
rey.motionMode = rey.walking;


rey.getStatus = function() {
    var statusString = jeff.emotion.name;
    statusString += "\n-------";
    statusString += "\nMotion mode: " + jeff.motionMode.description;
    return statusString;
}

rey.update = function() {
    if (rey.atBoundary() === true) {
        rey.incrementAngle(100);
    }
    rey.motionMode.update(); // Todo: IncrementAngle does not work when called from timed functions.  Not sure why not.
    this.basicUpdate();
};


//rey.update = function() {
// if (Math.random() < .1) {
//     //rey.angle += 100;
//     rey.incrementAngle(100);
// }
// if (Math.random() < .01) {
//     if (Math.random() < .5) {
//         rey.body.speed = 300;
//         rey.stateText = "Here comes the break-dancing mighty deer!";
//     } else {
//         rey.body.speed = 0;
//         rey.stateText = "Time to bust a move! *begins break-dancing*";
//     }
//}
//     rey.basicUpdate();

// }

rey.updateFiveSec = function() {
    console.log("Dancing")
}
