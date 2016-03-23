/**
 * Yang's Bot
 * @namespace yang
 * @type {Bot}
 */
var yang = new Bot(2700, 2700, 'yang', 'js/bots/yang/yang.png');

///////////////////////////////////////////////////////////////////////////
//One leve of variable only contains :                                   //
//basic variables and references                                         //
//basic functions that manipulate basic variables and references         //
//objects that has its own basic variables, basic functions and objects  //
//"_" marks objects                                                      //
///////////////////////////////////////////////////////////////////////////

/**
 * combine all debug related stuff.
 * @memberOf yang
 * @type {Object}
 */
yang.test_ = {};
/**
 * combine all text related varandfun.
 * @memberOf yang
 * @type {Object}
 */
yang.text_ = {};
/**
 * combine all additional non-initializor functions.
 * @memberOf yang
 * @type {Object}
 */
yang.fun_ = {};
/**
 * stores random number for repeated use.
 * @memberOf yang
 * @type {Object}
 */
yang.chaosmachine_ = {};
/**
 * basic bio states of resources.
 * @memberOf yang
 * @type {Object}
 */
yang.biomachine_ = {};
/**
 * basic mind states of spirit.
 * @memberOf yang
 * @type {Object}
 */
yang.mindmachine_ = {};
/**
 * A node of nothing.
 * @memberOf yang
 * @type {Object}
 */
yang.void_node = { type: "void" };
/**
 * major node's code storage
 * @memberOf yang
 * @type {Object}
 */
yang.node_ = {};
/**
 * stores sequences of productions
 * @memberOf yang
 * @type {Object}
 */
yang.production_ = {};
/**
 * fire upon collision
 * @memberOf yang.production_
 */
yang.production_.inter_action = [];
yang.production_.inter_reaction = [];
/**
 * goal related directional adjustment
 * @memberOf yang.production_
 */
yang.production_.direction = [];
/**
 * major node reference, those index names are magic
 * @memberOf yang
 * @type {Object}
 */
yang["mental_task_node"] = yang.void_node;
yang["speed_node"] = yang.void_node;
yang["acceleration_node"] = yang.void_node;
yang["rotation_node"] = yang.void_node;
/**
 * initializor called by system
 * @override
 * @function yang.init
 * @memberOf yang
 */
yang.init = function() {
    //setup body
    this.body = this.sprite.body;
    //Body
    yang.body.rotation = 0;
    yang.body.speed = 100;
    yang.temp_speed = 0;//for special movements
    //other basic variables
    yang.control = false; //detect cursor
    yang.basicupdate_disable = false;
    yang.unstable = false;
    //non state machine objects
    yang.init_plus();
    //state machines objects
    yang.init_state();
    //recurrent event
    if (yang.test_.test_ongoing) {
        game.time.events.loop(Phaser.Timer.SECOND * 5, yang.test_.timed_test, yang);
    } else {
        game.time.events.loop(Phaser.Timer.SECOND * 1, yang.timedEvend, yang);
    }
};
/**
 * initializor's helper
 * @function yang.init_plus
 * @memberOf yang
 */
yang.init_plus = function() { //object related initialization
    //Text Feedbacks
    yang.text_.stateText = "No Message";
    yang.text_.rotationText = "No Message";
    yang.text_.motionText = "No Message";
    yang.text_.interactiveText = "";
    yang.text_.testFeedBack = "";
    //test related
    yang.test_.ini = 0;
    yang.test_.test_ongoing = false;
    //yang.test_.test_ongoing = true;
    yang.test_.current_testnode = yang.def_node;
    //interaction production setup
    yang.collided_obj = {};
    yang.fun_.makeProductions
    //berry
    yang.berry = new yang.node_.id_prime_focus.berry_game_obj(); //see node
    //additional possiblity
    //yang.basespeed = 0;
    //yang.acceleration = 0;
    //setup relevent entity
    //yang
    //yang.home = new Entity(2700, 2700, 'Deer Bush', game);

};
/**
 * initializor's helper
 * @function yang.init_state
 * @memberOf yang
 */
yang.init_state = function() {
    //primary state machine that is not implemented using nodes
    //for random
    yang.chaosmachine_.randomness = 0; // stack over time and randomly empty into the bio and mind machines
    yang.chaosmachine_.chance = 0; // this store a random number for temperary use
    //basic bio states of two resources
    yang.biomachine_.metaresources_prime = 100; // deplete through time, replenished by event; 
    yang.biomachine_.metaresources_secondary = 0; // change through emptyness/inspiration, assume dualism causal relationship between mind and physic; 
    //basic mind states of two spirits
    yang.mindmachine_.inspiration = 0; // accumulate through contact event
    yang.mindmachine_.emptyness = 0; // accumulate through time
    //--------------------------------------------------------
    //state machines that uses nodes
    //mental nodes
    if (yang.test_.test_ongoing) {
        yang["mental_task_node"] = yang.def_node;
        yang["speed_node"] = yang.def_node;
        yang["acceleration_node"] = yang.def_node;
        yang["rotation_node"] = yang.def_node;
    } else {
        yang["mental_task_node"] = yang.node_.id_prime_focus;
        yang["speed_node"] = yang.node_.stop_node;
        yang["acceleration_node"] = yang.def_node;
        yang["rotation_node"] = yang.def_node;
    }
    //unfinished
    //TODO: move away 
    yang.tag = new yang.tag_game_obj(); // see helper
};
/**
 * game system accessors
 * @return {String} Display message in textbox
 * @override
 * @function yang.getStatus
 * @memberOf yang
 */
yang.getStatus = function() {
    if (yang.test_.test_ongoing) {
        yang.text_.stateText =
            "Test Mode" + "\n" +
            yang.text_.testFeedBack + "\n" +
            "Test node description: " + "\n" +
            //yang[yang.test_.current_testnode.type].description + "\n" +
            yang.test_.current_testnode.type + " node description:" + "\n" +
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
/**
 * game system manipulator
 * @override
 * @function yang.basicUpdate
 * @memberOf yang
 */
yang.basicUpdate = function() {//Update the velocity and angle of the bot to update it's velocity.
    //update non motion related parts of state machine
    if (!yang.test_.test_ongoing) {
        yang["mental_task_node"].always_fun();
        yang.fun_.AImotion_always_fun();
    }

    if (!yang.basicupdate_disable) {
        if (yang.unstable) {
            yang.body.speed = yang.temp_speed;
            yang.unstable = false;
        }
        game.physics.arcade.velocityFromRotation(
            this.sprite.rotation,
            this.sprite.body.speed,
            this.sprite.body.velocity);
    } else {
        yang.basicupdate_disable = false;
    }
    yang.genericUpdate();//yang.collisionCheck() are included
};
/**
 * game system manipulator
 * @override
 * @function yang.basicUpdate
 * @memberOf yang
 */
yang.update = function() {
    //real updates
    yang.pre_update();
    if (yang.test_.test_ongoing) {
        yang.test_.node_test();
    } else {
        yang["mental_task_node"].current_fun();
        yang.fun_.AImotion_current_fun(); //Main Cycle of movement statemachines
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
/**
 * game system manipulator's helper
 * @function yang.pre_update
 * @memberOf yang
 */
yang.pre_update = function() { // a reoccouring event...
    //Pre update
    //update text
    yang.text_.rotationText = "Rotation= " + Math.round(yang.body.rotation) +
        " Vs Angle(degree)= " + Math.round(yang.body.angle / Math.PI * 180);
    yang.text_.motionText = "Speed= " + yang.body.speed;
    yang.control = (cursors.up.isDown || cursors.down.isDown ||
        cursors.left.isDown || cursors.right.isDown);
};
/**
 * game system manipulator
 * @function yang.pre_update
 * @memberOf yang
 */
yang.timedEvend = function() {
    //use the following in init function
    //game.time.events.loop(Phaser.Timer.SECOND * 1, yang.timedEvend, yang);
    //console.log(game.time.totalElapsedSeconds());//save the line just in case
    //randomness
    yang.chaosmachine_.randomness += Math.round((Math.random() * 10));
    yang.chaosmachine_.randomness = Math.min(200, yang.chaosmachine_.randomness);
    //prime
    yang.biomachine_.metaresources_prime -= 2 * Math.round(yang.body.speed / 150); //change depend on speed
    yang.biomachine_.metaresources_prime = Math.round(yang.biomachine_.metaresources_prime);
    yang.biomachine_.metaresources_prime = Math.min(200, yang.biomachine_.metaresources_prime);
    yang.biomachine_.metaresources_prime = Math.max(0, yang.biomachine_.metaresources_prime);
    //secondary
    yang.biomachine_.metaresources_secondary -= 1;
    yang.biomachine_.metaresources_secondary = Math.min(200, yang.biomachine_.metaresources_secondary);
    yang.biomachine_.metaresources_secondary = Math.max(0, yang.biomachine_.metaresources_secondary);
    //empty
    yang.mindmachine_.emptyness += 5;
    yang.mindmachine_.emptyness = Math.min(200, yang.mindmachine_.emptyness);
    yang.mindmachine_.emptyness = Math.max(0, yang.mindmachine_.emptyness);
    //inspiration
    yang.mindmachine_.inspiration -= 1;
    yang.mindmachine_.inspiration = Math.min(200, yang.mindmachine_.inspiration);
    yang.mindmachine_.inspiration = Math.max(0, yang.mindmachine_.inspiration);
    //speical markov chain update
    yang.MRGPRB4.update();
    //Motions.zeleport.apply(yang);//TODO : redesign
    //clear interactive messages
    yang.text_.interactiveText = "";
};
/**
 * collision
 * @param {Object}
 * @memberOf yang
 * @Override
 */
yang.collision = function(object) {//collision
    yang.collided_obj = object;
    /*
    if ((object instanceof Bot) && yang.text_.interactiveText != "")
    {
        yang.speak(object, yang.text_.interactiveText);
    }
    */
    for (var brakeloop = 0; brakeloop < 2; brakeloop++) {    
        yang.node_.brake.brake();
    }
    yang.biomachine_.metaresources_secondary += 0.2;
    yang.biomachine_.metaresources_prime -= 0.1;
    fireProductions(yang.production_.inter_action);
    fireProductions(yang.production_.inter_reaction);
}
/**
 * called by init_plus
 * push actions and reactions into list
 * @param {Object}
 * @memberOf yang.fun_
 */
yang.fun_.makeProductions = function() {
    yang.production_.inter_action.push(
        new Production(
                "feast",
                Production.priority.High,
                yang.production_.feast_upon.condition_cal,
                yang.production_.feast_upon.act
        )
    );
    yang.production_.inter_reaction.push(
    );
    yang.production_.direction.push(
    );
}
/**
 * Additional Helper functions - Wrapper
 * @function yang.fun_.AImotion_current_fun
 * @memberOf yang.fun_
 */
yang.fun_.AImotion_current_fun = function() { //this is the current state
    yang["speed_node"].current_fun();
    yang["acceleration_node"].current_fun();
    //yang["rotation_node"].current_fun();
};
/**
 * Additional Helper functions - Wrapper
 * @function yang.fun_.AImotion_always_fun
 * @memberOf yang.fun_
 */
yang.fun_.AImotion_always_fun = function() { //this is the current state
    //wherever in here shouldn't affect control
    yang["speed_node"].always_fun();
    yang["acceleration_node"].always_fun();
    //yang["rotation_node"].always_fun();
};
/**
 * MRGPRB4 is a type of neuron that decide interaction events
 * @memberOf yang
 * @type {MarkovProcess}
 */
yang.MRGPRB4 = new MarkovProcess("wary");
yang.MRGPRB4.add("wary", [
    ["wary", "alert", "demanding", "caress", "annoyed"],
    [.5, .45, .2, .1, .2]
]);
yang.MRGPRB4.add("caress", [
    ["caress", "annoyed"],
    [.9, .1]
]);
yang.MRGPRB4.add("demanding", [
    ["caress", "wary", "demanding"],
    [.05, .05, 0.9]
]);
yang.MRGPRB4.add("alert", [
    ["alert", "annoyed"],
    [.5, .5]
]);
yang.MRGPRB4.add("annoyed", [
    ["annoyed", "wary"],
    [.8, .2]
]);
////////////////////////////
//Inter-action Production //
////////////////////////////
/**
 * eat
 * @memberOf yang.production
 * @param {Object}
 */
yang.production_.feast_upon = {};
yang.production_.feast_upon.condition_cal = function () {
    return ((yang.collided_obj instanceof Entity) &&
        (yang.collided_obj.name.toLowerCase()).search("berry") &&
        yang["mental_task_node"] == yang.node_.id_prime_focus);
}
yang.production_.feast_upon.act = function() {
    for (var brakeloop = 0; brakeloop < 2; brakeloop++) {    
        yang.node_.brake.brake();
    }
    yang.collided_obj.eat();//a function of food
}

//////////////////////////////
//Inter-reaction Production //
//////////////////////////////

////////////////////////////
//Inter-reaction Override //
////////////////////////////
/**
 * hear
 * @param {Object}
 * @param {String}
 * @memberOf yang
 * @Override
 */
yang.hear = function (botWhoSpokeToMe, whatTheySaid) {
     yang.text_.interactiveText = "mimic* " + botWhoSpokeToMe.name + ":" + whatTheySaid;
}
/**
 * highFived
 * @memberOf yang
 * @Override
 */
yang.highFived = function(botWhoHighFivedMe) {
    yang.speak (botWhoHighFivedMe, "Yoyoyo, let's party bruh.");
}
/**
 * Override to bitten reaction 
 * @memberOf yang
 * @Override
 * @param {Bot} botWhoBitedMe The bot that bit me
 * @param {Number} damage The amount of damage done
 */
yang.gotBit = function(botWhoBitedMe, damage) {
    //lose some resources
    //console.log(botWhoBitedMe.name + "attacked me!");
};
/**
 * Override to antler_caressed reaction 
 * @memberOf yang
 * @Override
 * @param {Bot} botWhocaresedMe The bot that bit me
 * @param {String} text message
 */
yang.antler_caressed = function(botWhocaresedMe, message) {
    // whoelse would do this?
    // console.log(botWhocaresedMe.name + "If you stroke this antler, you will be blessed by the wisps that lives on them.");
};
/**
 * Override to gotCrushed reaction
 * @memberOf yang
 * @Override 
 * @param {Bot} botWhoCrushMe The bot that bit me
 */
yang.gotCrushed = function(botWhoCrushMe) {
    //lose significant amount of resources
    //declare death
    //playmusic
    //reset bot
    //change mood
    //console.log(botToCrush.name + " got crushed by dylan.");
};
/**
 * Override to react when bowed down to 
 * @memberOf yang
 * @Override
 * @param {Bot} botWhoBowed bot who bowed down to me
 */
yang.gotBow = function(botWhoBowed) {
    //secondary resources++
    //console.log(botWhoBowed.name + "bowed down to " + this.name);
};
/**
 * Override to react when got Licked
 * @memberOf yang
 * @Override
 * @param {Bot} botWhoBowed bot who bowed down to me
 */
yang.gotLicked = function(botWhoLickedMe) {
    //???
    // console.log(botWhoLickedMe.name + " licked " + this.name);
};
/**
 * Override to react when ignored
 * @memberOf yang
 * @Override
 * @param  {Bot} botWhoIgnoredToMe who ignored me
 */
yang.gotIgnored = function(botWhoIgnoredMe) {
    //???
};
///////////////
//Nodes Zone //
///////////////
/**
 * Nodes constructor
 * @memberOf yang.fun_
 * @constructor
 * @param  {String} Node Type
 */
//default node constructor
yang.fun_.def_node_construct = function(node_type) { //arguement is string
    if (!new.target) throw "def_node_construct() must be called with new";
    //the methods are attempted to listed in an order of calling by game functions
    this.type = node_type; //used for switch
    this.description = "Default"; //used to write state text
    this.init_fun = function() { //only call once
    };
    this.current_fun = function() { //player control sensitive
        //a switch
        if (false) {
            this.switch_to_this_node();
        }
    };
    this.always_fun = function() { //unrelated to player control
        //a switch
        if (false) {
            this.switch_to_this_node();
        }
    };
    //everyone node has a switch to itself, so other nodes can just call node method
    this.switch_to_this_node = function() {
        yang[this.type] = this;
        this.init_fun();
    };
};

/**
 * default node has type "void", and does nothing
 * @memberOf yang
 */
yang.def_node = new yang.fun_.def_node_construct("void");
////////////////////////////////////////////////////
//Base Speed Nodes                                //
//Base speed completely depends on meta resources //
////////////////////////////////////////////////////
/**
 * stop
 * @memberOf yang.node_
 */
yang.node_.stop_node = new yang.fun_.def_node_construct("speed_node");
yang.node_.stop_node.description = "Deer's body doesn't feel energitic.",
yang.node_.stop_node.init_fun = function() {
    yang.node_.brake.switch_to_this_node();
};
yang.node_.stop_node.current_fun = function() { //unrelated to control
    if (yang.biomachine_.metaresources_prime >= 50) {
        yang.node_.slow_node.switch_to_this_node();
    }
};
/**
 * slow
 * @memberOf yang.node_
 */
yang.node_.slow_node = new yang.fun_.def_node_construct("speed_node");
yang.node_.slow_node.description = "Deer's body still has fuel.";
yang.node_.slow_node.init_fun = function() { //only call once
    yang.node_.wander.switch_to_this_node();
};
yang.node_.slow_node.current_fun = function() { //control sensitive   
    yang.body.speed = Math.max(100, yang.body.speed);
};
yang.node_.slow_node.always_fun = function() {   
    if (yang.biomachine_.metaresources_prime < 10) {
        yang.node_.stop_node.switch_to_this_node();
    } else if (yang.biomachine_.metaresources_secondary >= 50) {
        yang.node_.fast_node.switch_to_this_node();
    }
};
/**
 * fast
 * @memberOf yang.node_
 */
yang.node_.fast_node = new yang.fun_.def_node_construct("speed_node");
yang.node_.fast_node.description = "Deer's body feels lighter than usual.";
yang.node_.fast_node.init_fun = function() { //only call once
    yang.node_.gallop.switch_to_this_node();
};
yang.node_.fast_node.current_fun = function() { //control sensitive   
    yang.body.speed = Math.max(200, yang.body.speed);
};
yang.node_.fast_node.always_fun = function() {
    if (yang.biomachine_.metaresources_secondary < 10) {
        yang.node_.slow_node.switch_to_this_node();
    }
};
////////////////////////////////////////////////////////////
//Acceleration Nodes                                      //
//switch of acceleration nodes depend on base speed nodes //
////////////////////////////////////////////////////////////
/**
 * TO DO : Production Chain instead
 * @memberOf yang.node_
 */
yang.node_.lay = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.lay.description = "Deer lays down and eat grass. Tastes terrible!";
yang.node_.lay.current_fun = function() { //control sensitive
    yang.node_.lay.description = "Deer lays down and eat grass. Tastes terrible!";
    yang.biomachine_.metaresources_prime += 0.1;
};
yang.node_.lay.always_fun = function() {
    if (yang.control) {
        this.description = "Deer pushes forward.";
    }
};
/**
 * brake
 * @memberOf yang.node_
 */
yang.node_.brake = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.brake.description = "";
yang.node_.brake.brake = function () {
    if (yang.body.speed > 0) {
        yang.body.speed = Math.floor(yang.body.speed * 9 / 10);
    }
}
yang.node_.brake.current_fun = function() { //control sensitive
    if (yang.body.speed <= 30) {
        yang.node_.lay.switch_to_this_node();
        yang.body.speed = 0;
    } else {
        yang.node_.lay.description = "Deer slows down.";
        yang.node_.brake.brake();
    }
};
yang.node_.brake.always_fun = function() {
    yang.node_.lay.always_fun();//only change description
};
/**
 * wander
 * @memberOf yang.node_
 */
yang.node_.wander = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.wander.description = "Deer wanders.";
yang.node_.wander.current_fun = function() { //control sensitive
    yang.chaosmachine_.chance = Math.random();
    if (yang.chaosmachine_.chance <= .50) {
        yang.body.speed += 5;
    } else if (yang.chaosmachine_.chance > .50) {
        yang.body.speed -= 4;
    }
    yang.chaosmachine_.chance = 0;
    //no switches
};
/**
 * gallop
 * @memberOf yang.node_
 */
yang.node_.gallop = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.gallop.description = "Deer is in motion.";
yang.node_.gallop.current_fun = function() { //control sensitive
    if (yang.mindmachine_.inspiration >= 70 && !yang.node_.leap.leap_loop) {
        yang.node_.leap.switch_to_this_node();
    }
    if (yang.body.speed < 300) {
        yang.chaosmachine_.chance = Math.random();
        if (yang.chaosmachine_.chance <= .50) {
            yang.body.speed += 2;
        } else if (yang.chaosmachine_.chance > .50) {
            yang.body.speed -= 1;
        }
        yang.chaosmachine_.chance = 0;
    }
};
/**
 * leap
 * @memberOf yang.node_
 */
yang.node_.leap = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.leap.eap_loop = false;
yang.node_.leap.loop_counts = 0;
yang.node_.leap.leap_random = 0;
yang.node_.leap.description = "Berries allude Deer! Majestic!";
yang.node_.leap.init_fun = function() { //only call once   
    yang.node_.leap.leap_loop = true;
    yang.node_.leap.loop_counts = 50;
    yang.node_.leap.leap_random = Math.random();
};
yang.node_.leap.current_fun = function() { //control sensitive
    //continue leap till end
    //Todo: try simplify somehow, maybe use a timed event...watchout control
    if (yang.node_.leap.loop_counts > 41) {
        yang.body.speed += 75;
        yang.node_.leap.loop_counts -= 2;
    } else if (yang.node_.leap.loop_counts > 9) {
        yang.node_.leap.loop_counts -= 1;
    } else if (yang.node_.leap.loop_counts > 0) {
        yang.node_.brake.current_fun();
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
    } else { //end leap motion
        yang.node_.leap.loop_counts = 0;
        yang.node_.leap.leap_loop = false;
        yang.node_.gallop.switch_to_this_node();
    }
};

////////////////////////////////
//Rotation Nodes Under design //
////////////////////////////////

////////////////////////////////////////////////////////////////////////
//Mental Task(Id-Ego-Super) Nodes                                     //
//mental task is independent from motions, use always _fun more often //
////////////////////////////////////////////////////////////////////////
/**
 * hunger
 * TO DO : eat production
 * TO DO : new philoberry Sense
 * @memberOf yang.node_
 */
yang.node_.id_prime_focus = new yang.fun_.def_node_construct("mental_task_node");
yang.node_.id_prime_focus.berry_game_obj = function() {
    //[x,y] initialized as starting location
    // for now, philoberry entity is in botplayground.js with fixed location
    this.berry_coord = [2700, 2700];
    this.berry_distance = 0; //calculate later
    /*//berry spawn mechanic, currently disabled
    this.create_new_berry = function () {
        this.berry_coord[0] = Math.random() * 10000 % 860 + 70; // 70 - 930
        this.berry_coord[1] = Math.random() * 10000 % 860 + 70; // 70 - 930
    };*/
};
yang.node_.id_prime_focus.description = ""; //write by functions
yang.node_.id_prime_focus.init_fun = function() { //only call once
    //berry spawn mechanic, currently disabled
    //game.add etcetc
};
yang.node_.id_prime_focus.always_fun = function() { //ignore control
    yang.berry.berry_distance = Math.round(
        game.physics.arcade.distanceToXY(yang.sprite,
            yang.berry.berry_coord[0],
            yang.berry.berry_coord[1]));
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
    if (yang.biomachine_.metaresources_prime >= 50) { //belly filled
        if (Math.random() >= 0.5) {
            yang.node_.superego_brood_focus.switch_to_this_node();
        } else {
            yang.node_.superego_drain_focus.switch_to_this_node();
        }
    }
};
/**
 * moody
 * uses primary resources to transform emptyness into inspiration
 * @memberOf yang.node_
 */ 
yang.node_.superego_brood_focus = new yang.fun_.def_node_construct("mental_task_node");
yang.node_.superego_brood_focus.description = "The life is in general disappointing, but Deer is still appreciating. What are holy and profane?";
yang.node_.superego_brood_focus.init_fun = function() { //only call once 
    yang.biomachine_.metaresources_prime -= yang.chaosmachine_.randomness;
    yang.mindmachine_.emptyness -= yang.chaosmachine_.randomness;
    yang.mindmachine_.inspiration += yang.chaosmachine_.randomness;
    yang.chaosmachine_.randomness = 0;
};
yang.node_.superego_brood_focus.always_fun = function() { //control sensitive
    if (yang.biomachine_.metaresources_prime < 10) {
        yang.node_.id_prime_focus.switch_to_this_node();
    } else if (yang.biomachine_.metaresources_secondary >= 90) {
        yang.node_.superego_drain_focus.switch_to_this_node();
    }
};
/**
 * drain
 * uses secondary resources for inspiration at high cost
 * @memberOf yang.node_
 */ 
yang.node_.superego_drain_focus = new yang.fun_.def_node_construct("mental_task_node");
yang.node_.superego_drain_focus.description = "The life has been fair, but a deer always desires better.";
yang.node_.superego_drain_focus.init_fun = function() { //only call once 
    yang.biomachine_.metaresources_secondary -= yang.chaosmachine_.randomness * 3;
    yang.mindmachine_.inspiration += yang.chaosmachine_.randomness;
    yang.chaosmachine_.randomness = 0;
};
yang.node_.superego_drain_focus.always_fun = function() { //control sensitive
    if (yang.biomachine_.metaresources_prime < 10) {
        yang.node_.id_prime_focus.switch_to_this_node();
    } else if (yang.mindmachine_.emptyness >= 90) {
        yang.node_.superego_brood_focus.switch_to_this_node();
    } else if (yang.mindmachine_.inspiration >= 50) {
        yang.node_.id_secondary_focus.switch_to_this_node();
    }
};
/**
 * void
 * gain secondary resources from pleasant social event
 * @memberOf yang.node_
 */
yang.node_.id_secondary_focus = new yang.fun_.def_node_construct("mental_task_node");
yang.node_.id_secondary_focus.description = "No one catches Deer~";
yang.node_.id_secondary_focus.always_fun = function() { //control sensitive
    //tag game mechanism, currently disabled
    if (false) {
        yang.biomachine_.metaresources_secondary += yang.chaosmachine_.randomness;
    }
    //switch check
    if (yang.mindmachine_.emptyness >= 90) {
        yang.node_.superego_brood_focus.switch_to_this_node();
    }
};
//////////////
//Test Zone //
//////////////
/**
 * unfinished tag game
 * @memberOf yang
 */
//TO DO
//redesign
yang.tag_game_obj = function() {
    this.it; //index in the bots
    this.tagger_list = ["jeff", "sharAI"]; //the name tags
};
/**
 * Test - Update
 * @function yang.test_.node_test
 * @memberOf yang.test_
 */
yang.test_.node_test = function() { // test with a permanate state

    //single run node test 

    if (yang.test_.ini === 0) {
        //
        yang.chaosmachine_.randomness = 0;
        yang.biomachine_.metaresources_prime = 1;
        yang.biomachine_.metaresources_secondary = 100;
        yang.mindmachine_.emptyness = 0;
        yang.mindmachine_.inspiration = 0;
        //test node
        /*
        yang.test_.current_testnode = yang.def_node();
        yang.test_.current_testnode.init_fun();
        yang.test_.current_testnode.always_fun();
        yang.test_.current_testnode.current_fun();
        yang.test_.current_testnode.switch_to_this_node();
        */   
        
        yang.test_.ini++;
    }

    //fixed node test
    //
};
/**
 * Test - timeevent
 * @function yang.test_.timed_test
 * @memberOf yang.test_
 */
yang.test_.timed_test = function() {
};

/*
Timed Rotation
1.forward_dodge [high]
[collision_in_1_sec] ­ > [forward_doge]
2.head_home [low]
[sleepy] ­ > [head_home]
7.visit_friend [low]
[nothing_to_do] ­ > [visit_friend_home]


5.curious [low]
[frequency_of_nonhostile_encounter] ­ > [follow]


collision
8.debate [low]
[friend_is_near && both_stop] ­ > [debate]
9.spar [low]
[friend_is_near && has_martial_art] ­ > [spar]
12.inspection [low]
[collision] ­ > [look_at_obstacle]


3.wary [medium]
[dangerous_obj_is_near] ­ > [stare_at_obj]
4.relax_mood [low]
[well_fed] ­ > [lower_awareness_range]


Others:
6.dream [medium]
[many_unsatisfied_instinct] ­ > [dream]
10.interven [high]
[weak_friend_is_near && danger_is_near] ­ > [block_between_friend_and_foe]
11.environment_preservation [low]
[nothing_is_going_on] ­ > [grow_berries_trees]
*/


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

/*Yang's action - reaction
Bot.prototype.antler_caress = function(botTocaress, message) {
    console.log(botTocaress.name + message);
};

Bot.prototype.antler_caressed = function(botWhocaresedMe, message) {
    console.log(botWhocaresedMe.name + "attacked me!");
};
*/





/*extra resources
http://phaser.io/docs/2.4.4/Phaser.Physics.Arcade.Body.html
*/
