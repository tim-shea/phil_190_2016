var yang = new Bot(2700, 2700, 'yang','bots/yang/yang.png');
//One leve of variable only contains :
//basic variables and references
//basic functions that manipulate basic variables and references 
//objects that has its own basic variables, basic functions and objects 
//"_" marks objects
yang.test_ = {}; //combine all debug related stuff
yang.text_ = {}; //combine all text related varandfun
yang.fun_ = {}; //combine all additional non-initializor functions
yang.chaosmachine_ = {}; //for random
yang.biomachine_ = {}; //basic bio states of two resources
yang.mindmachine_ = {}; //basic mind states of two spirit
yang.node_ = {}; //store non-default nodes

//major node reference, those index names are magic
yang.void_node = {type : "void"}; //an object of nothing, completely useless
yang["mental_task_node"] = yang.void_node;
yang["speed_node"] = yang.void_node;
yang["acceleration_node"] = yang.void_node;
yang["rotation_node"] = yang.void_node;





//-------------------initializors-------------
yang.init = function() {
    //setup body
    this.body = this.sprite.body;
    //recurrent event
    game.time.events.loop(Phaser.Timer.SECOND * 1, yang.timedEvend, yang);
    game.time.events.loop(Phaser.Timer.SECOND * 5, yang.test_.timed_test, yang);
    //Body
    yang.body.rotation = 0;
    yang.body.speed = 100;
    //other basic variables
    yang.control = false; //detect cursor
    //non state machine objects
    yang.init_plus();
    //state machines objects
    yang.init_state();
};

yang.init_plus = function() {//object related initialization
    //Text Feedbacks
    yang.text_.stateText = "No Message";
    yang.text_.rotationText = "No Message";
    yang.text_.motionText = "No Message";
    //test related
    yang.test_.ini = 0;
    //yang.test_.test_ongoing = false;
    yang.test_.test_ongoing = true;
    yang.test_.current_testnode = yang.def_node;
    //berry
    yang.berry = new yang.node_.id_prime_focus.berry_game_obj();//see node
    //additional possiblity
    //yang.basespeed = 0;
    //yang.acceleration = 0;
    //setup relevent entity
    //yang
    //yang.home = new Entity(2700, 2700, 'Deer Bush', game);

};


yang.init_state = function () {   
    //primary state machine that is not implemented using nodes
    //for random
    yang.chaosmachine_.randomness = 0;// stack over time and randomly empty into the bio and mind machines
    yang.chaosmachine_.chance = 0; // this store a random number for temperary use
    //basic bio states of two resources
    yang.biomachine_.metaresources_prime = 100; // deplete through time, replenished by event; 
    yang.biomachine_.metaresources_secondary = 0; // change through emptyness/inspiration, assume dualism causal relationship between mind and physic; 
    //basic mind states of two spirits
    yang.mindmachine_.inspiration = 0; // accumulate through contact event
    yang.mindmachine_.emptyness = 0;  // accumulate through time
    //--------------------------------------------------------
    //state machines that uses nodes
    //mental nodes
    //yang["mental_task_node"] = yang.node_.id_prime_focus;
    yang["mental_task_node"] = yang.def_node;
    //AImovement Nodes
    //yang["speed_node"] = yang.node_.stop_node;
    yang["speed_node"] = yang.def_node;
    yang["acceleration_node"] = yang.def_node;
    //unfinished
    yang["rotation_node"] = yang.def_node;
    //
    yang.tag = new yang.tag_game_obj(); // see helper
};


//---------game system accessors-------------
//can estimate other bot's location
yang.getStatus = function() {
    if (yang.test_.test_ongoing) {
        yang.text_.stateText = 
            "Test Mode" + "\n" +
            yang.test_.current_testnode.description + "\n" +            
            yang.text_.rotationText + "\n" +
            yang.text_.motionText + "\n" +
            "prime resources \t= " + yang.biomachine_.metaresources_prime + "\n" +
            "secondary resources = " + yang.biomachine_.metaresources_secondary + "\n" +
            "emptyness = " + yang.mindmachine_.emptyness + "\n" +
            "inspiration \t= " + yang.mindmachine_.inspiration + "\n" +
            "randomness = " + yang.chaosmachine_.randomness;
    } else {
        yang.text_.stateText = 
            yang["mental_task_node"].description + "\n" + 
            yang["speed_node"].description + " " + 
            yang["acceleration_node"].description;
    }
    return yang.text_.stateText;
};

//---------game system manipulators-------------
//Update the velocity and angle of the bot to update it's velocity.
yang.basicUpdate = function() {
    //update non motion related parts of state machine
    if (!yang.test_.test_ongoing) {
       yang["mental_task_node"].always_fun();
    }
    game.physics.arcade.velocityFromRotation(
        this.sprite.rotation,
        this.sprite.body.speed,
        this.sprite.body.velocity);
};

yang.update = function() {
    //real updates
    yang.pre_update();
    if (yang.test_.test_ongoing) {
        yang.test_.node_test();
    } else {
        yang["mental_task_node"].current_fun();
        yang.main_AImovements();//Main Cycle of movement statemachines
    }
    //temperory solution before rotation nodes are made
    if (yang.atBoundary()) {
        yang.incrementAngle(100);
    }
    yang.chaosmachine_.chance = Math.random();
    if (yang.chaosmachine_.chance <= .10) {
        yang.incrementAngle(4);
    } else if (yang.chaosmachine_.chance >= .90) {
        yang.incrementAngle(-4);
    }
    yang.chaosmachine_.chance = 0;
    yang.basicUpdate();    
}; 

yang.pre_update = function() {// a reoccouring event...
    //Pre update
    //update text
    yang.text_.rotationText = "Rotation= " + Math.round(yang.body.rotation) + 
        " Vs Angle(degree)= " + Math.round(yang.body.angle / Math.PI * 180);
    yang.text_.motionText = "Speed= " + yang.body.speed;
    yang.control = (cursors.up.isDown || cursors.down.isDown || 
        cursors.left.isDown || cursors.right.isDown);
};

yang.timedEvend = function() {
    //use the following in init function
    //game.time.events.loop(Phaser.Timer.SECOND * 1, yang.timedEvend, yang);
    //console.log(game.time.totalElapsedSeconds());//save the line just in case
    
    if (yang.chaosmachine_.randomness < 200) {
        yang.chaosmachine_.randomness += Math.round((Math.random() * 10));
    }
    
    if (yang.biomachine_.metaresources_prime > -200) {
        yang.biomachine_.metaresources_prime -= 5 * Math.round(yang.body.speed / 150); // change depend on speed
    }
    
    if (yang.biomachine_.metaresources_secondary > -200) {
        yang.biomachine_.metaresources_secondary -= 1;
    }
    
    if (yang.mindmachine_.emptyness < 200) {
        yang.mindmachine_.emptyness += 5;
    }
    
    if (yang.mindmachine_.inspiration < 200) {
        yang.mindmachine_.inspiration -= 1;
    } 
};

//-------Additional Helper functions-----------
yang.main_AImovements = function () { //this is the current state
    //main should only controlls physical movements so that it can avoid control***********
    yang["speed_node"].current_fun();
    yang["acceleration_node"].current_fun();
    //yang["rotation_node"].current_fun();
};

//need to remove into a node
yang.tag_game_obj = function () {
    this.it; //index in the bots
    this.tagger_list = ["jeff", "sharAI"];//the name tags
};



yang.test_.node_test = function () { // test with a permanate state
    if (yang.test_.ini === 0) {
        //
        yang.chaosmachine_.randomness = 0;
        yang.biomachine_.metaresources_prime = 1;
        yang.biomachine_.metaresources_secondary = 100;
        yang.mindmachine_.emptyness = 0;
        yang.mindmachine_.inspiration = 0;
        //test node
        //yang.test_.current_testnode = yang.node_.stop_node;
        yang.test_.current_testnode.init_fun();
        yang.test_.current_testnode.always_fun();    
        yang.test_.current_testnode.current_fun();
        
        yang.test_.ini ++;
    }
};

yang.test_.timed_test = function() {
};


//default node constructor
yang.fun_.def_node_construct = function (node_type) {//arguement is string
        if (!new.target) throw "def_node_construct() must be called with new";
        //the methods are attempted to listed in an order of calling by game functions
        this.type = node_type; //used for switch
        this.description = "Default"; // used to write state text
        this.init_fun = function () { //only call once
        };
        this.current_fun = function () { //player control sensitive
            //a switch
            if (false) {
                this.switch_to_this_node();
            } 
        };
        this.always_fun = function () { //unrelated to player control
            //a switch
            if (false) {
                this.switch_to_this_node();
            }
        };
        //everyone node has a switch to itself, so other nodes can just call node method
        this.switch_to_this_node = function () {
            yang[this.type] = this;
            this.init_fun();
        };
};

//default node 
//default node has type "void"
yang.def_node = new yang.fun_.def_node_construct("void");
/*obsolete defaut node model
//but still shows what a node would have
yang.def_node = {
    this.type : "some machine, //used for switch
    description : "Default", //used for statetext
    init_fun : function () { //only call once   
    },
    always_fun : function () {
        if (false) {
            yang.def_node.switch_to_this_node();
        }
    },
    current_fun : function () { //control sensitive
        //console.log(yang.def_node.description);
        if (false) {
            yang.def_node.switch_to_this_node();
        } 
    },
    //everyone node has a switch to itself, so other nodes can just call this one
    switch_to_this_node : function () { 
        yang.test_.current_testnode = yang.def_node;
        yang.def_node.init_fun();
    }
};*/

//--------Base Speed Nodes----------------------
// Base speed is completely depends on meta resources
yang.node_.stop_node = new yang.fun_.def_node_construct("speed_node");  
yang.node_.stop_node.description = "Deer's body doesn't feel energitic.",
yang.node_.stop_node.init_fun = function () { //only call once
    yang.body.speed = 0;
    yang.node_.lay.switch_to_this_node(); 
};
yang.node_.stop_node.current_fun = function () { //control sensitive
    if (yang.biomachine_.metaresources_prime < 10) {
        yang.node_.stop_node.switch_to_this_node(); //restart this node.
    }
    if (yang.biomachine_.metaresources_prime >= 10) {
        yang.node_.slow_node.switch_to_this_node();
    }
};



yang.node_.slow_node = new yang.fun_.def_node_construct("speed_node");
yang.node_.slow_node.description = "Deer's body still has fuel.";
yang.node_.slow_node.init_fun = function () { //only call once   
    yang.body.speed = 100;
    yang.node_.wander.switch_to_this_node(); 
};
yang.node_.slow_node.current_fun = function () { //control sensitive
    //add acceleration here
    if (yang.biomachine_.metaresources_prime < 10) {
        yang.node_.stop_node.switch_to_this_node();
    } else if (yang.biomachine_.metaresources_secondary >= 10) {
        yang.node_.fast_node.switch_to_this_node();
    }
};



yang.node_.fast_node = new yang.fun_.def_node_construct("speed_node");
yang.node_.fast_node.description = "Deer's body feels lighter than usual.";
yang.node_.fast_node.init_fun = function () { //only call once   
    yang.body.speed = 200; 
    yang.node_.gallop.switch_to_this_node();
};
yang.node_.fast_node.current_fun = function () { //control sensitive
    if (yang.state.inspiration >= 70 && !yang.node_.leap.leap_loop) {
        yang.node_.leap.switch_to_this_node();
    }
    if (yang.state.metaresources_secondary < 10) {
        yang.node_.gallop.switch_to_this_node();
    } 
};



//--------Acceleration Nodes---------------------------
//switch of acceleration nodes depend on base speed nodes 
yang.node_.lay = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.lay.description = "";
yang.node_.lay.always_fun = function () { //only call once 
    if (!yang.control) {
            yang.node_.lay.description = "Deer lays down.";
    }  
};
yang.node_.lay.current_fun = function () { //control sensitive
    yang.node_.lay.description = "Deer pushes forward.";
};



yang.node_.wander = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.wander.description = "Deer wanders.";
yang.node_.wander.current_fun = function () { //control sensitive
    yang.chaosmachine_.chance = Math.random();
    if (yang.chaosmachine_.chance <= .50) {
        yang.body.speed += 5;
    } else if (yang.chaosmachine_.chance > .50) {
        yang.body.speed -= 4;
    }
    yang.chaosmachine_.chance = 0;
    //no switches
};



yang.node_.gallop = new yang.fun_.def_node_construct("acceleration_node");    
yang.node_.gallop.description = "Deer is in motion.";
yang.node_.gallop.current_fun = function () { //control sensitive
    if (yang.body.speed < 300) {
        yang.chaosmachine_.chance = Math.random();
        if (yang.chaosmachine_.chance <= .50) {
            yang.body.speed += 2;
        } else if (yang.chaosmachine_.chance > .50) {
            yang.body.speed -= 1;
        }
        yang.chaosmachine_.chance = 0;
    }
    //no switch
};



yang.node_.leap = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.leap.eap_loop = false;
yang.node_.leap.loop_counts = 0;
yang.node_.leap.leap_random = 0;
yang.node_.leap.description = "Berries allude Deer! Majestic!";
yang.node_.leap.init_fun = function () { //only call once   
    yang.node_.leap.leap_loop = true;
    yang.node_.leap.loop_counts = 50;
    yang.node_.leap.leap_random = Math.random();
};
yang.node_.leap.current_fun = function () { //control sensitive
    //continue leap till end
    //Todo: try simplify somehow, maybe use a timed event...watchout control
    if (yang.node_.leap.loop_counts > 41) {
        yang.speed += 75;
        yang.node_.leap.loop_counts -= 2;
    } else if (yang.node_.leap.loop_counts > 9) {
        yang.node_.leap.loop_counts -= 1;
    } else if (yang.node_.leap.loop_counts > 0) {
        yang.speed -= 75;
        yang.node_.leap.loop_counts -= 2;
    } else if (yang.chaosmachine_.chance > 0.5) {
        yang.node_.leap.loop_counts = 50;
        yang.chaosmachine_.chance -= 0.5;
    } else if (yang.chaosmachine_.chance > 0.25) {
        yang.node_.leap.loop_counts = 50;
        yang.chaosmachine_.chance -= 0.25;
    } else if (yang.chaosmachine_.chance > 0.1) {
        yang.node_.leap.loop_counts = 50;
        yang.chaosmachine_.chance -= 0.1;
    } else {//end leap motion
        yang.node_.leap.loop_counts = 0; 
        yang.node_.leap.leap_loop = false;
        yang.node_.gallop.switch_to_this_node();
    }
};



//--------Rotation Nodes----------------
//Under design



//--------Mental Task(Ego) Nodes------------------
//id_focus, super_ego_focus
//can be very complicated, beware
//!!!!mental task is independent from motions, use always _fun more often!!!!
//first one basically a hungry mechanic
yang.node_.id_prime_focus = new yang.fun_.def_node_construct("mental_task_node");
yang.node_.id_prime_focus.berry_game_obj = function () {
    //[x,y] initialized as starting location
    // for now, philoberry entity is in botplayground.js with fixed location
    this.berry_coord = [2500, 2500];
    this.berry_distance = 0;//calculate later
    /*//berry spawn mechanic, currently disabled
    this.create_new_berry = function () {
        this.berry_coord[0] = Math.random() * 10000 % 860 + 70; // 70 - 930
        this.berry_coord[1] = Math.random() * 10000 % 860 + 70; // 70 - 930
    };*/
};
yang.node_.id_prime_focus.description = ""; //write by functions
yang.node_.id_prime_focus.init_fun = function () {//only call once
    //berry spawn mechanic, currently disabled
    //game.add etcetc
};
yang.node_.id_prime_focus.always_fun = function () {//ignore control
    yang.berry.berry_distance = 
        game.physics.arcade.distanceToXY 
            (yang.sprite, 
            yang.berry.berry_coord[0], 
            yang.berry.berry_coord[1]);
    yang.node_.id_prime_focus.description = 
        "Deer senses a philoberry grows at " + 
        yang.berry.berry_distance +
        " pixels away.";
    if (yang.berry.berry_distance < 50) { 
        //eat berry and grow a new one
        yang.biomachine_.metaresources_prime += 200;
        //berry spawn mechanic, currently disabled
    }
    //switch check
    if (yang.biomachine_.metaresources_prime >= 50) {//belly filled
        if (Math.random() >= 0.5) {
            yang.node_.superego_brood_focus.switch_to_this_node();
        } else {
            yang.node_.superego_drain_focus.switch_to_this_node();
        }
    }
};



//uses primary resources to transform emptyness into inspiration 
yang.node_.superego_brood_focus = new yang.fun_.def_node_construct("mental_task_node"); 
yang.node_.superego_brood_focus.description = "The life is in general disappointing, but Deer is still appreciating. What are holy and profane?";
yang.node_.superego_brood_focus.init_fun = function () { //only call once 
    yang.biomachine_.metaresources_prime -= yang.chaosmachine_.randomness;
    yang.mindmachine_.emptyness -= yang.chaosmachine_.randomness;
    yang.mindmachine_.inspiration += yang.chaosmachine_.randomness;
    yang.chaosmachine_.randomness = 0;  
};
yang.node_.superego_brood_focus.always_fun = function () { //control sensitive
    if (yang.biomachine_.metaresources_prime < 10) {
        yang.node_.id_prime_focus.switch_to_this_node();
    } else if (yang.biomachine_.metaresources_secondary >= 90) {
        yang.node_.superego_drain_focus.switch_to_this_node();
    }
};



//uses secondary resources for inspiration at high cost
yang.node_.superego_drain_focus = new yang.fun_.def_node_construct("mental_task_node"); 
yang.node_.superego_drain_focus.description = "The life has been fair, but a deer always desires better.";
yang.node_.superego_drain_focus.init_fun = function () { //only call once 
    yang.biomachine_.metaresources_secondary -= yang.chaosmachine_.randomness * 3;
    yang.mindmachine_.inspiration += yang.chaosmachine_.randomness;
    yang.chaosmachine_.randomness = 0;  
};
yang.node_.superego_drain_focus.always_fun = function () { //control sensitive
    if (yang.biomachine_.metaresources_prime < 10) {
        yang.node_.id_prime_focus.switch_to_this_node();
    } else if (yang.mindmachine_.emptyness >= 90 ) {
        yang.node_.superego_brood_focus.switch_to_this_node();
    } else if (yang.mindmachine_.inspiration >= 50) {
        yang.node_.id_secondary_focus.switch_to_this_node();
    }
};




//gain secondary resources from pleasant social event
yang.node_.id_secondary_focus = new yang.fun_.def_node_construct("mental_task_node"); 
yang.node_.id_secondary_focus.description = "No one catches Deer~";
yang.node_.id_secondary_focus.always_fun = function () { //control sensitive
    //tag game mechanism, currently disabled
    if (false) { 
        yang.biomachine_.metaresources_secondary += yang.chaosmachine_.randomness;
    }
    //switch check
    if (yang.mindmachine_.emptyness >= 90) {
        yang.node_.superego_brood_focus.switch_to_this_node();
    } 
};



// ------Back Yard---------------------------------------------------
//useful notes
//yang.body.rotation + " Vs " + yang.body.angle / Math.PI * 180
//usefulfunctions
//distance = 
//game.physics.arcade.distanceToXY(yang.sprite, jeff.sprite.x, jeff.sprite.y)
//.distanceBetween(jeff.sprite, yang.sprite)
//
//movement =
//yang.body.rotation = game.physics.arcade.moveToObject(yang.sprite, jeff.sprite, 500, 1);
//
// add objects=
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
http=//phaser.io/docs/2.4.4/Phaser.Physics.Arcade.Body.html
*/
