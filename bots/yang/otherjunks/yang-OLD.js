//though global, only use once
var yang_home = [2700, 2700];

var yang = new Bot(yang_home[0], yang_home[1], 'yang','bots/yang/yang.png');

yang.init = function() {//all variables are here
    //setup body
    this.body = this.sprite.body;
    //setup relevent entity
    //yang
    //yang.home = new Entity(yang_home[0], yang_home[1], 'Deer Bush', game);


    //recurrent event
    game.time.events.loop(Phaser.Timer.SECOND * 1, yang.timedEvend, yang);
    game.time.events.loop(Phaser.Timer.SECOND * 5, yang.test_timedEvend, yang);
    //Body
    yang.body.rotation = 0;
    yang.body.speed = 100;
    //new properties
    //motion related
    yang.control = false;
    yang.update_yet = false;
    //Text Feedbacks
    yang.stateText = "Test Mode";
    yang.rotationText = "No Message";
    yang.motionText = "No Message";
    //state machine
    yang.state = new yang.state_machine_input();//initialize state inputs
    //nodes
    yang.current_testnode = yang.def_node;
    //mental nodes
    yang.current_mentaltask_node = yang.primeres_focus;
    //AImovement Nodes
    yang.current_speed_node = yang.stop_node;
    //unfinished
    yang.current_acceleration_node = yang.def_node;
    yang.current_rotation_node = yang.def_node;
    //motion node related
    yang.basespeed = 0;
    yang.acceleration = 0;

    yang.tag = new yang.tag_game_obj(); // see helper
    yang.berry = new yang.berry_game_obj(); // see helper

    yang.chance;
    //test
    yang.ini = 0;
};

//can estimate other bot's location
yang.getStatus = function() {
    //return yang.stateText; //comment this line to get other text;
    //testmode
    return yang.stateText + "\n" +
           yang.current_mentaltask_node.description + "\n" + 
           yang.current_speed_node.description + " " + yang.current_acceleration_node.description + "\n" +           
           yang.rotationText + "\n" +
           yang.motionText + "\n" +
           //game.physics.arcade.distanceBetween(jeff.sprite, yang.sprite) + "\n" +
           "inspiration \t: " + yang.state.inspiration + "\n" +
           "primeresources \t: " + yang.state.metaresources_prime + "\n" +
           "secondaryresources : " + yang.state.metaresources_secondary + "\n" +
           "randomness : " + yang.state.randomness + "\n" +
           "emptyness : " + yang.state.emptyness;
};


// Update the velocity and angle of the bot to update it's velocity.
yang.basicUpdate = function() {
    //yang will always update using the always fun
    //this feature overrides the cursor down in the main universal update, instead handle the controlled condition inside complexupdate()
    if (!yang.update_yet) {
        yang.complexupdate();
    } else { //else yang is NOT under controll and able to update  
        //temperory solution before rotation nodes are made
        if (yang.atBoundary()) {
            yang.incrementAngle(100);
        }
        //temporary random
        yang.chance = Math.random();
        if (yang.chance <= .10) {
            yang.incrementAngle(4);
        } else if (yang.chance >= .90) {
            yang.incrementAngle(-4);
        }

    }
    yang.update_yet = false; // for next cycle
    game.physics.arcade.velocityFromRotation(
        this.sprite.rotation,
        this.sprite.body.speed,
        this.sprite.body.velocity);
};

yang.update = function() {
    yang.complexupdate();
    yang.basicUpdate(); // do nothing other than that
}; 

yang.complexupdate = function() {// a reoccouring event...
    //Pre update
    yang.update_yet = true; // update is called
    yang.rotationText = "Rotation: " + Math.round(yang.body.rotation) + 
        " Vs Angle(degree): " + Math.round(yang.body.angle / Math.PI * 180);
    yang.motionText = "Speed: " + yang.body.speed;
    yang.control = (cursors.up.isDown || cursors.down.isDown || 
        cursors.left.isDown || cursors.right.isDown);
    //yang.preupdate(); //this function construct next main_AImovements
    //Main Cycle
    //yang.state.test = true; //comment this line to disable test mode
    if (yang.state.test) {
        yang.test_fun();
        yang.current_mentaltask_node.always_fun();
        yang.current_mentaltask_node.current_fun();
    } 
    if (!yang.state.test && !yang.control){
        yang.main_AImovements();//Main Cycle of movement statemachine
    }
    //end update
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
    yang.state.inspiration -= 1; // accumulate through contact
    yang.state.metaresources_prime -= 5 * Math.round(yang.body.speed / 150); // change through states
    yang.state.metaresources_secondary -= 1;
};

//-------Additional Helper functions-----------
yang.state_machine_input = function() { //default constructor
    this.test = false; //for test
    this.inspiration = 0; // accumulate through contact event
    this.emptyness = 0; // accumulate through time
    this.metaresources_prime = 100; // deplete through time, replenished by event
    this.metaresources_secondary = 0; // change through emptyness/inspiration
    this.randomness = 0; // stack over time and randomly empty into emptyness/inspiration    
}

yang.tag_game_obj = function () {
    this.it; //index in the bots
    this.tagger_list = ["jeff", "sharAI"];//the name tags
}

yang.berry_game_obj = function () {
    this.berry_coord = [yang.x, yang.x];//[x,y] initialized as starting location
    this.berry_distance = 0;

    /*disable for now
    this.create_new_berry = function () {
        this.berry_coord[0] = Math.random() * 10000 % 860 + 70; // 70 - 930
        this.berry_coord[1] = Math.random() * 10000 % 860 + 70; // 70 - 930
    };*/
}

yang.main_AImovements = function () { //this is the current state
    //main should only controlls physical movements so that it can avoid control***********
    yang.current_speed_node.current_fun();
    yang.current_acceleration_node.current_fun();
    //yang.current_rotation_node.current_fun();
};

yang.test_fun = function () { // test with a permanate state
    if (yang.ini === 0) {
        //
        yang.state.metaresources_prime = 1;
        yang.state.metaresources_secondary = 100;
        //
        yang.state.emptyness = 0;
        yang.state.inspiration = 0;
        yang.state.randomness = 0;
        /*test node
        yang.current_testnode = yang.def_node;
        yang.current_testnode.initial();    
        yang.current_testnode.current_fun();
        */
        yang.ini++;
    }
};

yang.test_timedEvend = function() {
};

//default node KEEPCOPY EET
yang.def_node = {
    description : "Default",
    initial : function () { //only call once   
    },
    always_fun : function () {
         /* body... */ 
    },
    current_fun : function () { //control sensitive
        //console.log(yang.def_node.description);
        if (false) {
            yang.def_node.switch_to_this_node();
        } 
    },
    //everyone node has a switch to itself, so other nodes can just call this one
    switch_to_this_node : function () { 
        yang.current_testnode = yang.def_node;
        yang.def_node.initial();
    }
};

//--------Base Speed Nodes
// Base speed is completely depends on meta resources
yang.stop_node = { //stop -extremly low prime meta resources
    description : "Deer's body doesn't feel energitic.",
    initial : function () { //only call once
        yang.body.speed = 0;
        yang.lay.switch_to_this_node(); 
    },
    always_fun : function () {
         /* body... */ 
    },
    current_fun : function () { //control sensitive
        //add acceleration here
        if (yang.state.metaresources_prime < 10) {
            yang.stop_node.switch_to_this_node(); //restart this node.
        }
        if (yang.state.metaresources_prime >= 10) {
            yang.slow_node.switch_to_this_node();
        }
    },
    switch_to_this_node : function () {
        yang.current_speed_node = yang.stop_node;
        yang.current_speed_node.initial();
    }
};

yang.slow_node = {
    description : "Deer's body still has fuel.",
    initial : function () { //only call once   
        yang.body.speed = 100;
        yang.wander.switch_to_this_node(); 
    },
    always_fun : function () {
         /* body... */ 
    },
    current_fun : function () { //control sensitive
        //add acceleration here
        if (yang.state.metaresources_prime < 10) {
            yang.stop_node.switch_to_this_node();
        } else if (yang.state.metaresources_secondary >= 10) {
            yang.fast_node.switch_to_this_node();
        }
    },
    switch_to_this_node : function () {
        yang.current_speed_node = yang.slow_node;
        yang.current_speed_node.initial();
    }
};

yang.fast_node = {
    description : "Deer's body feels lighter than usual.",
    initial : function () { //only call once   
        yang.body.speed = 200; 
        yang.gallop.switch_to_this_node();
    },
    always_fun : function () {
         /* body... */ 
    },
    current_fun : function () { //control sensitive
        if (yang.state.inspiration >= 70 && !yang.leap.leap_loop) {
            yang.leap.switch_to_this_node();
        }

        if (yang.state.metaresources_secondary < 10) {
            yang.def_node.switch_to_this_node();
        } 
    },
    switch_to_this_node : function () {
        yang.current_speed_node = yang.fast_node;
        yang.current_speed_node.initial();
    }
};
//--------Acceleration Nodes

yang.lay = {
    description : "Deer lays down.",
    initial : function () { //only call once   
    },
    current_fun : function () { //control sensitive
    },
    switch_to_this_node : function () { 
        yang.current_acceleration_node = yang.lay;
        yang.current_acceleration_node.initial();
    }
};

yang.wander = {
    description : "Deer wanders.",
    initial : function () { //only call once   
    },
    always_fun : function () {
         /* body... */ 
    },
    current_fun : function () { //control sensitive
        yang.chance = Math.random();
        if (yang.chance <= .50) {
            yang.body.speed += 5;
        } else if (yang.chance > .50) {
            yang.body.speed -= 4;
        }
        //no switches
    },
    switch_to_this_node : function () { 
        yang.current_acceleration_node = yang.wander;
        yang.current_acceleration_node.initial();
    }
};

yang.gallop = {
    description : "Deer is in motion.",
    initial : function () { //only call once   
    },
    always_fun : function () {
         /* body... */ 
    },
    current_fun : function () { //control sensitive
        if (yang.body.speed < 300) {
            yang.chance = Math.random();
            if (yang.chance <= .50) {
                yang.body.speed += 2;
            } else if (yang.chance > .50) {
                yang.body.speed -= 1;
            }
        }
        //no switch
    },
    switch_to_this_node : function () { 
        yang.current_acceleration_node = yang.gallop;
        yang.current_acceleration_node.initial();
    }
};

yang.leap = {
    leap_loop : false,
    loop_counts : 0,
    leap_random : 0,
    description : "Berries allude Deer! Majestic!",
    initial : function () { //only call once   
        yang.leap.leap_loop = true;
        yang.leap.loop_counts = 50;
        yang.leap.leap_random = Math.random();
    },
    always_fun : function () {
         /* body... */ 
    },
    current_fun : function () { //control sensitive
        //continue leap till end
        if (yang.leap.loop_counts > 41) {
            yang.speed += 75;
            yang.leap.loop_counts -= 2;
        } else if (yang.leap.loop_counts > 9) {
            yang.leap.loop_counts -= 1;
        } else if (yang.leap.loop_counts > 0) {
            yang.speed -= 75;
            yang.leap.loop_counts -= 2;
        } else if (yang.chance > 0.5) {
            yang.leap.loop_counts = 50;
            yang.chance -= 0.5;
        } else if (yang.chance > 0.25) {
            yang.leap.loop_counts = 50;
            yang.chance -= 0.25;
        } else if (yang.chance > 0.1) {
            yang.leap.loop_counts = 50;
            yang.chance -= 0.1;
        } else {//end leap motion
            yang.leap.loop_counts = 0; 
            yang.leap.leap_loop = false;
            yang.gallop.switch_to_this_node();
        }
    },
    switch_to_this_node : function () { 
        yang.current_acceleration_node = yang.leap;
        yang.current_acceleration_node.initial();
    }
};
//--------Rotation Nodes

//--------mental_task_Nodes
//mental tasks aim to manage the two meta resources
yang.primeres_focus = {
    description : "", //write later
    initial : function () { //only call once
        //yang.berry.create_new_berry();
    },
    always_fun : function () {
        yang.berry.berry_distance = 
            game.physics.arcade.distanceToXY 
            (yang.sprite, yang.berry.berry_coord[0], yang.berry.berry_coord[1]);
        yang.primeres_focus.description = 
            "Deer senses a philoberry grows at " + 
            yang.berry.berry_distance +
            " pixels away.";
    },
    current_fun : function () { //control sensitive
        if (yang.berry.berry_distance < 50) { // eat berry and grow a new one
            yang.state.metaresources_prime += 200;
            //yang.berry.create_new_berry();
        }
        //switch check
        if (yang.state.metaresources_prime >= 50) {//belly filled
            if (Math.random() >= 0.5) {
                yang.brood_focus.switch_to_this_node();
            } else {
                yang.drain_focus.switch_to_this_node();
            }
        }
    },
    switch_to_this_node : function () {
        yang.current_mentaltask_node = yang.primeres_focus;
        yang.current_mentaltask_node.initial();
    }
};

yang.brood_focus = { //uses primary resources to transform emptyness into inspiration 
    description : "The life is in general disappointing, but Deer is still appreciating. What are holy and profane?",
    initial : function () { //only call once 
        yang.state.metaresources_prime -= yang.state.randomness;
        yang.state.emptyness -= yang.state.randomness;
        yang.state.inspiration += yang.state.randomness;
        yang.state.randomness = 0;  
    },
    always_fun : function () {
         /* body... */ 
    },
    current_fun : function () { //control sensitive
        if (yang.state.metaresources_prime < 10) {
            yang.primeres_focus.switch_to_this_node();
        } else if (yang.state.metaresources_secondary >= 90) {
            yang.drain_focus.switch_to_this_node();
        }
    },
    switch_to_this_node : function () {
        yang.current_mentaltask_node = yang.brood_focus;
        yang.current_mentaltask_node.initial();
    }
};

yang.drain_focus = {//uses secondary resources for inspiration at high cost
    description : "The life has been fair, but the Deer always desires better.",
    initial : function () { //only call once 
        yang.state.metaresources_secondary -= yang.state.randomness * 3;
        yang.state.inspiration += yang.state.randomness;
        yang.state.randomness = 0;  
    },
    always_fun : function () {
         /* body... */ 
    },
    current_fun : function () { //control sensitive
        if (yang.state.metaresources_prime < 10) {
            yang.primeres_focus.switch_to_this_node();
        } else if (yang.state.emptyness >= 90 ) {
            yang.brood_focus.switch_to_this_node();
        } else if (yang.state.inspiration >= 50) {
            yang.secondary_focus.switch_to_this_node();
        }
    },
    switch_to_this_node : function () {
        yang.current_mentaltask_node = yang.drain_focus;
        yang.current_mentaltask_node.initial();
    }
};

yang.secondary_focus = {//gain secondary resources from social
    description : "No one catches Deer~",
    initial : function () { //only call once   
    },
    always_fun : function () {
         /* body... */ 
    },
    current_fun : function () { //control sensitive
        //tag game mechanism
        if (false) { 
            yang.state.metaresources_secondary += yang.state.randomness;
        }
        //switch check
        if (yang.state.emptyness >= 90) {
            yang.brood_focus.switch_to_this_node();
        } 
    },
    switch_to_this_node : function () {
        yang.current_mentaltask_node = yang.secondary_focus;
        yang.def_node.initial();
    }
};









// ------Back Yard---------------------------------------------------
//useful notes
//yang.body.rotation + " Vs " + yang.body.angle / Math.PI * 180
//usefulfunctions
//distance : 
//game.physics.arcade.distanceToXY(yang.sprite, jeff.sprite.x, jeff.sprite.y)
//.distanceBetween(jeff.sprite, yang.sprite)
//
//movement :
//yang.body.rotation = game.physics.arcade.moveToObject(yang.sprite, jeff.sprite, 500, 1);
//
// add objects:
// this.sprite = game.add.sprite(x, y, name);



/*overrideable basic functions of prototype bot
/*nothing yet overwrite prototype 
yang.getBasicStats = function() {};

// Helper function to update angle
//override bot increment angle
yang.incrementAngle = function(amount) {
    this.body.rotation += amount;
    this.body.rotation = this.body.rotation % 180;
}
//
*/

//other edits
/* 
botplayground.html
<script src="bots/yang/yang.js"></script>
<option value="yang">Yang</option>

/*under preload function
game.load.image('oakTree', 'assets/oakTree.png');

/*under create function
var troll_garden
var philoberry_bush
var predator
var troll






botplayground.js
var bots = [jeff, mouse, yang];
*/









/*extra resources
http://phaser.io/docs/2.4.4/Phaser.Physics.Arcade.Body.html
*/
