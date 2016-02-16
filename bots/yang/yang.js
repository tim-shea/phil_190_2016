var yang = new Bot(500, 500, 'yang','bots/yang/yang.png');

yang.init = function() {//all variables are here
    //setup body
    this.body = this.sprite.body;
    //recurrent event
    game.time.events.loop(Phaser.Timer.SECOND * 1, yang.timedEvend, yang);
    //Body
    yang.body.rotation = 0;
    yang.body.speed = 100;

    //new properties

    //Text Feedbacks
    yang.stateText = "Test Mode";
    yang.rotationText = "No Message";
    yang.motionText = "No Message";
    //function list
    yang.deer_mainTask = []; //current goal
    yang.deer_mainResolve = []; //solve resources problems
    yang.deer_mainSpeed = []; //speed
    //motion related
    yang.control = false;
    yang.state = new state_machine_input();
    yang.tag = new tag_game_obj(); // see helper
    yang.berry = new berry_game_obj(); // see helper

    yang.chance;
    yang.leap = 0;

};

/*nothing yet
yang.getBasicStats = function() {};
*/

//can estimate other bot's location
yang.getStatus = function() {
    //return yang.stateText; //comment this line to get other text;
    //testmode
    return yang.stateText + "\n" +
           yang.rotationText + "\n" +
           yang.motionText + "\n" +
           yang.sprite.x + " : : " + jeff.sprite.x + "\n" +
           yang.sprite.y + " : : " + jeff.sprite.y + "\n" +
           "inspiration \t: " + yang.state.inspiration + "\n" +
           "primeresources \t: " + yang.state.metaresources_prime + "\n" +
           "secondaryresources : " + yang.state.metaresources_secondary + "\n" +
           "randomness : " + yang.state.randomness + "\n" +
           "emptyness : " + yang.state.emptyness;
};


yang.update = function() {// a reoccouring event...
    //Pre update
    yang.rotationText = "Rotation: " + yang.body.rotation;
    yang.motionText = "Speed: " + yang.body.speed;
    yang.control = (cursors.up.isDown || cursors.down.isDown || 
        cursors.left.isDown || cursors.right.isDown);
    yang.preupdate(); //this function construct next deer_main
    //Main Cycle
    yang.state.test = true; //comment this line to disable test mode
    if (yang.state.test && (!yang.control)) {
        yang.test_fun();
    } else if (!yang.control){
        yang.deer_main();//Main Cycle Function of statemachine
    }
    //end update
    yang.basicUpdate();
    // according to basicUpdate, 
    // bots update their "velocity" and "angle" 
    // speed and rotation
};

yang.timedEvend = function() {
    // use the following in init function
    //game.time.events.loop(Phaser.Timer.SECOND * 1, yang.timedEvend, yang);
    //console.log(game.time.totalElapsedSeconds());//save the line just in case
    yang.state.emptyness += 5;
    yang.state.randomness += Math.round((Math.random() * 10));
    yang.state.inspiration = 0; // accumulate through contact
    yang.state.metaresources_prime -= 5; // change through states
    yang.state.metaresources_secondary -= 1;
};

//-------Additional Helper functions-----------
function state_machine_input () { //default constructor
    this.test = false; //for test
    this.inspiration = 0; // accumulate through contact event
    this.emptyness = 0; // accumulate through time
    this.metaresources_prime = 100; // deplete through time, replenished by event
    this.metaresources_secondary = 0; // change through emptyness/inspiration
    this.randomness = 0; // stack over time and randomly empty into emptyness/inspiration    
}

function tag_game_obj () {
    this.it; //index in the bots
    this.tagger_list = ["jeff", "sharAI"];//the name tags
}

function berry_game_obj () {
    this.berry_coord = [0, 0];//[x,y]
    this.create_new_berry = function () {
        this.berry_coord[0] = Math.random() * 10000 % 860 + 70; // 70 - 930
        this.berry_coord[1] = Math.random() * 10000 % 860 + 70; // 70 - 930
    };
}

yang.deer_main = function () { //this is the current state
    //a dynamic function list call
    for (var i = 0; i < yang.deer_mainTask.length; i++) {
        yang.deer_mainTask[i]();
    }
    for (var j = 0; j < yang.deer_mainResolve.length; j++) {
        yang.deer_mainResolve[j]();
    }
    for (var k = 0; k < yang.deer_mainSpeed.length; k++) {
        yang.deer_mainSpeed[k]();
    }
};

yang.test_fun = function () { // test with a permanate state
    yang.state.inspiration = 0; // accumulate through contact
    yang.state.randomness = 0; // stack over time and empty into emptyness/inspiration

    yang.state.metaresources_prime = 0; // change through states
    yang.state.metaresources_secondary = 0; // change through emptyness/inspiration
    
    yang.state.emptyness = 0; // accumulate through time
    //test function 
    yang.deer_main();
};
/*
yang.motion00_relax = 
yang.motion01_brood = 
yang.motion01_brood = 

/*overrideable basic functions of prototype bot
//
// Helper function to update angle
// override bot increment angle
yang.incrementAngle = function(amount) {
    this.body.rotation += amount;
    this.body.rotation = this.body.rotation % 180;
}
//
// Update the velocity and angle of the bot to update it's velocity.
yang.basicUpdate = function() {
    
    /*game.physics.arcade.velocityFromRotation(
        this.sprite.rotation,
        this.sprite.body.speed,
        this.sprite.body.velocity);
};


//other edit
/* 
botplayground.html
<script src="bots/yang/yang.js"></script>
<option value="yang">Yang</option>

botplayground.js
var bots = [jeff, mouse, yang];
*/