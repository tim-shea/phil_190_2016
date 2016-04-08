/**
 * Construct a bot.
 *
 * @class
 *
 * @param {Number} x initial x coordinate
 * @param {Number} y initial y coordinate
 * @param {string} name name of the bot
 * @param {string} path path to the bot (e.g....)
 */
function Bot(x, y, name, path) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.imagePath = path;
    this.home_x = x;
    this.home_y = y;

    // Parent sprite.  Generally speaking, the body (see below) should be
    //   modified, not this.   But sometimes the reference is useful.
    //   See http://phaser.io/docs/2.4.4/index
    this.sprite;

    // Reference to the body of the sprite.  Play with this!
    // See http://phaser.io/docs/2.4.4/Phaser.Physics.Arcade.Body.html 
    this.body;

    // Eating each other is not yet supported.
    this.isEdible = false;

    // Override motion when in pursuit, etc.
    this.motionOverride = false;

    // A reference to the current tween so that multiple tweens are not initiated at once
    this.currentTween = null;

    // A reference to the current speech item
    this.currentSpeech = null;

    // A reference to any sound playing now
    this.currentSound = null;

    // Reference to shield, if any...
    this.shield = null;

    // Network stuff
    this.lastMemory;
    this.currentMemory;
    this.currentTransition;
    this.setNetwork();
    // If below true, show nodes and edges by their activation values (hides regular labels)
    this.showActivations = false;
};

// DO NOT CHANGE.  Temporary variable to avoid errors on startup.    The 'real' variable is in botPlayground.js
var memoryOn = true;

/**
 * Returns a status string that describes the bot's internal state
 *
 * @return text for the status field on the web page
 */
Bot.prototype.getStatus = function() {
    return "Status function not yet defined for bot: " + this.name;
};

/**
 * Override to initialize the bot
 */
Bot.prototype.init = function() {};

/**
 * Called every time the game is updated.  
 */
Bot.prototype.update = function() {};

/**
 * Update the velocity and angle of the bot to update it's velocity.
 *
 * TODO: Possibly change name to something more descriptive.
 * A basic default update style.
 */
Bot.prototype.basicUpdate = function() {
    if (this.motionOverride) {
        return;
    }
    game.physics.arcade.velocityFromRotation(
        this.sprite.rotation,
        this.sprite.body.speed,
        this.sprite.body.velocity);
};

/**
 * Generic update method
 */
Bot.prototype.genericUpdate = function() {
    this.collisionCheck();
    game.world.wrap(this.sprite);
    if (this.speechBubble) {
        this.speechBubble.x = this.sprite.x + 50;
        this.speechBubble.y = this.sprite.y - 40;
    }
    if (this.shield) {
        this.shield.x = this.sprite.x - 45;
        this.shield.y = this.sprite.y - 45;
    }
    game.physics.arcade.collide(this.sprite, entityGroup);
};

/**
 * Returns true if the bot is at the boundary of the world, false otherwise
 *
 * @return {Boolean} true if at the boundary, false otherwise
 */
Bot.prototype.atBoundary = function() {
    // Not sure why onWall fails on top and bottom,
    //  so adding in cases manually
    if (this.body.onWall()) {
        return true;
    }
    if (this.body.onFloor()) {
        return true;
    }
    if (this.body.y < 1) {
        return true;
    }
    return false;
}

/**
 * Display a shield around the agent for 1 second
 */
Bot.prototype.defend = function() {
    if (!this.shield) {
        console.log(this.shield);
        this.shield = game.add.sprite(this.sprite.x - 45, this.sprite.y - 45, "shield");
    }
    timer = game.time.events.add(1000, function() {
        if (this.shield) { this.shield.kill();
            this.shield = null; } }, this);
}

/**
 * Returns a random number between floor and ceiling 
 *  Calculates midpoint and difference between the given amounts to 
 *  calculate a random number between the amounts
 *  Example of how to use:  "Daniel.incrementAngle(Daniel.getRandom(-5, 5));"
 * note that it looks like Phaser supplies an integer version of this.
 * e.g. game.rnd.integerInRange(0, 7));
 * 
 * @param  {Number} floor bottom value
 * @param  {Number} ceiling top value
 * @return {Number} the random number
 *
 * @author Daniel
 */
Bot.prototype.getRandom = function(floor, ceiling) {
    var midpoint = (ceiling + floor) / 2;
    var difference = ceiling - floor;
    var randomBetween = difference * Math.random() - (difference / 2) + midpoint;
    return randomBetween;
}

/**
 * Increment the angle of the agent. 
 * @param  {Number} amount amount to increment the angle
 */
Bot.prototype.incrementAngle = function(amount) {
    this.sprite.body.rotation += amount;
    this.sprite.body.rotation = this.sprite.body.rotation % 180;
}

/**
 * Face towards the indicated object
 */
Bot.prototype.orientTowards = function(objectToFace, minInterEvent = 5000, multiplier = 1) {
    if (!objectToFace || cursorDown || this.currentTween != null) {
        return;
    }
    this.currentTween = {}; // Using currentTween as flag.
    this.sprite.rotation = multiplier * game.physics.arcade.angleBetween(this.sprite, objectToFace.sprite);
    timer = game.time.events.add(minInterEvent, function() { this.currentTween = null; }, this);

}

/**
 * Face away from the indicated object
 */
Bot.prototype.faceAwayFrom = function(objectToFaceAwayFrom, minInterEvent = Phaser.Timer.SECOND * .5) {
    this.orientTowards(objectToFaceAwayFrom, minInterEvent, -Math.PI);
    // TODO: Not quite right.
}

/**
 * Pursue the indicated object, for the indicated duration (in milliseconds), using a custom easing if desired
 *
 * Rough guideline on durations: 1000 = 1 second is fast, 100 is 1/10 second is super fast, 5000 = 5 seconds is slow
 * 
 * Easings listed here: http://phaser.io/docs/2.4.4/Phaser.Easing.html
 */
Bot.prototype.pursue = function(objectToPursue, duration = 500, easing = Phaser.Easing.Exponential.In) {
    if (!objectToPursue || cursorDown || this.currentTween != null || this.motionOverride) {
        return;
    }
    this.motionOverride = true;
    this.currentTween = game.add.tween(this.sprite);
    let rad = game.physics.arcade.angleBetween(this.sprite, objectToPursue.sprite);
    let new_x = objectToPursue.sprite.x - Math.cos(rad) * 100;
    let new_y = objectToPursue.sprite.y - Math.sin(rad) * 100;
    this.sprite.rotation = rad;

    this.currentTween.to({ x: new_x, y: new_y }, duration, easing);
    this.currentTween.onComplete.add(function() {
        this.currentTween = null;
        this.motionOverride = false;
    }, this);
    this.currentTween.start();
}

/**
 * Run away from an object.  Todo: Improve!
 * 
 * @param  {Bot} object the thing to move away from
 */
Bot.prototype.moveAwayFrom = function(object) {
    if (!object || cursorDown) {
        return;
    }
    this.faceAwayFrom(object);
    this.body.speed = 1500;
    this.basicUpdate();
}

/**
 * Attack the specified bot, currently just by moving twice towards it
 * @param  {Bot} objectToAttack the object to attack
 * @param  {Number} numAttacks how many times to "attack". 
 */
Bot.prototype.attackMotion = function(objectToAttack, numAttacks = 2) {
    if (!objectToAttack || cursorDown || this.currentTween != null || this.motionOverride) {
        return;
    }
    this.motionOverride = true;
    this.orientTowards(objectToAttack);
    this.currentTween = game.add.tween(this.sprite);
    this.currentTween.to({ x: objectToAttack.sprite.x, y: objectToAttack.sprite.y },
        200, Phaser.Easing.Linear.None, false, 0, numAttacks - 1, true);
    // currentTween.onUpdateCallback(function() {theBot.faceTowards(objectToAttack);}); // works
    this.currentTween.onComplete.add(function() {
        this.currentTween = null;
        this.motionOverride = false;
    }, this);
    this.currentTween.start();

    // Chaining tween test
    // var backUpTween = game.add.tween(this.sprite);
    // backUpTween.to({ x: 800, y: 800 },
    //     200, Phaser.Easing.Linear.None, true, 0, true);
    // backUpTween.onComplete.add(function() { console.log("Done2");
    //     this.currentTween = null; this.motionOverride = false; }, this);
    // currentTween.chain(backUpTween);

}

/**
 * Go to the indicated location on screen, at the indicated speed
 * (Duration in milliseconds it will take to get there.)
 *
 * Easings listed here: http://phaser.io/docs/2.4.4/Phaser.Easing.html
 */
Bot.prototype.goto = function(x, y, duration = 1000, easing = Phaser.Easing.Exponential.InOut) {
    if (cursorDown || this.currentTween != null || this.motionOverride) {
        return;
    }
    this.motionOverride = true;
    this.currentTween = game.add.tween(this.sprite);
    this.currentTween.to({ x: x, y: y }, duration, easing);
    this.currentTween.onComplete.add(function() {
        this.motionOverride = false;
        this.currentTween = null
    }, this);
    this.currentTween.start();
}

/**
 * Go to your specified home location.
 * @param  {Number} duration how long to take in milliseconds to get home
 * @param  {Easing} easing  the easing to use (see above)
 */
Bot.prototype.goHome = function(duration = 1000, easing = Phaser.Easing.Exponential.InOut) {
    this.goto(this.home_x, this.home_y, duration, easing);
}

/**
 * Helper function to determine if one sprite overlaps another.
 * 
 * @param  {sprite} object 1
 * @param  {sprite} object 2
 * @return {boolean} true if overlap, false otherwise
 */
Bot.objectsOverlap = function(item1, item2) {
    if (item1 != item2) {
        // Add a border around first object so that overlap is detected even when "nearby"
        return Phaser.Rectangle.intersects(Phaser.Rectangle.inflate(item1.getBounds(), 10, 10), item2.getBounds());
    }
    return false;
}

/**
 * Returns the distance between this bot and a specified object. 
 */
Bot.prototype.getDistanceTo = function(otherObject) {
    return game.physics.arcade.distanceBetween(this.sprite, otherObject.sprite);;
}

/**
 * Returns an array of objects in a specified radius of this one, ordered by distance.
 *
 * To get nearest object: getNearbyObjects[0]
 */
Bot.prototype.getNearbyObjects = function(radius = 250) {
    var centerPoint = new Phaser.Point(50, 50);
    var triggerDistance = 100;
    var nearbyObjects = [];
    var theBot = this.sprite;
    bots.forEach(function(bot) {
        let distance = Phaser.Math.distance(bot.sprite.x, bot.sprite.y, theBot.x, theBot.y);
        if (distance <= radius) {
            if (bot.sprite != theBot) {
                bot.temp_distance = distance;
                nearbyObjects.push(bot);
            }
        }
    });
    entities.forEach(function(entity) {
        let distance = Phaser.Math.distance(entity.sprite.x, entity.sprite.y, theBot.x, theBot.y);
        if (distance <= radius) {
            entity.temp_distance = distance;
            nearbyObjects.push(entity);
        }
    });
    nearbyObjects = nearbyObjects.sort(
        function(a, b) {
            return (a.temp_distance < b.temp_distance);
        });
    // nearbyObjects.forEach(function(entity) {
    //     console.log(entity.name + "," + entity.temp_distance);
    // });   
    return nearbyObjects;
}

/**
 * Returns an array of objects in a specified radius of this one, ordered by distance.
 *
 * To get nearest object: getNearbyObjects[0]
 */
Bot.prototype.getNearbyBots = function(radius = 250) {
    return this.getNearbyObjects(radius).filter(function(object) {
        return object instanceof Bot;
    });
}

/**
 * Returns a random object (bot or static entity)
 *
 * @return {Object} the random entity
 */
Bot.prototype.getRandomObject = function() {
    let allObjects = entities.concat(bots);
    let chosenEntity = allObjects[game.rnd.integerInRange(0, allObjects.length - 1)]
    return chosenEntity;
}

/**
 * Returns a random bot
 *
 * @return {Bot} the bot entity
 */
Bot.prototype.getRandomBot = function() {
    return bots[game.rnd.integerInRange(0, bots.length - 1)];
}

/**
 * Returns a list of any other bots the bot is overlapping
 * 
 * @return {array} overlapping objects
 */
Bot.prototype.getOverlappingBots = function() {
    let me = this.sprite;
    let overlappingObjects = [];

    // Other bots
    bots.forEach(function(bot) {
        if (Bot.objectsOverlap(me, bot.sprite)) {
            overlappingObjects.push(bot);
        }
    });

    return overlappingObjects;
}

/**
 * Returns a list of any objects the bot is overlapping
 * 
 * @return {array} overlapping objects
 */
Bot.prototype.getOverlappingEntities = function() {
    let me = this.sprite;
    let overlappingObjects = [];

    // Static entities (ignore background)
    entities.forEach(function(entity) {
        if (entity.sprite.key && entity.sprite.key !== "background") {
            if (Bot.objectsOverlap(me, entity.sprite)) {
                overlappingObjects.push(entity);
            }
        }
    });
    return overlappingObjects;
}

/**
 * Check if overlapping an entity.
 *
 * @return {boolean} true if overlapping something, false otherwise
 */
Bot.prototype.collisionCheck = function() {
    let overlappingObjects = this.getOverlappingEntities().concat(this.getOverlappingBots());
    if (overlappingObjects.length > 0) {
        this.collision(overlappingObjects[0]);
    }
}

/**
 * When another entity collides with this bot, this function is called.
 *
 * Override this function to reaction to collisions.
 *
 * @param {object} the object collided with
 */
Bot.prototype.collision = function(object) {
    console.log(this.name + " collided with " + object.name);
}

/**
 * Pursue food in the indicated radius
 */
Bot.prototype.findFood = function(radius = 500, edibilityFunction) {
    var nearbyFoods = this.getNearbyObjects(radius).filter(function(object) {
        return edibilityFunction(object);
    });
    if (nearbyFoods.length > 0) {
        this.pursue(nearbyFoods[0]);
    }
}

/**
 * Attack bots in the indicated radius
 */
Bot.prototype.attackNearbyBots = function(radius = 500) {
    var nearbyBots = this.getNearbyBots(radius);
    if (nearbyBots.length > 0) {
        this.bite(nearbyBots[0], 100);
    }
}

/**
 * Say something to the specified bot for a specified amount of time in seconds.
 * @param {Bot} botToTalkTo the bot to talk to
 * @param {String} whatToSay what was said
 * @param  {Number} howLong how long to say it for in milliseconds
 */
Bot.prototype.speak = function(botToTalkTo, whatToSay, howLong = 2000) {
    if (this.currentSpeech != null || !(botToTalkTo instanceof Bot)) {
        return;
    }

    // Call the listeners "hear" function
    this.makeSpeechBubble(whatToSay, howLong);
    if (game.physics.arcade.distanceBetween(this.sprite, botToTalkTo.sprite) < 100) {
        botToTalkTo.hear(this, whatToSay);
    }
}

/**
 * Make a speech bubble but don't "talk" to someone.
 *
 * @param  {String} text what to say
 * @param  {Number} howLong  how long to say it in milliseconds.
 */
Bot.prototype.makeSpeechBubble = function(text, howLong = 1500) {
    if (this.currentSpeech != null) {
        return;
    }
    // Activate the speech Bubble
    this.currentSpeech = text;
    this.speechBubble = game.world.add(new SpeechBubble(game, this.x + 50, this.y - 40, 256,
        text));
    game.time.events.add(howLong, function() {
        this.speechBubble.visible = false;
        this.speechBubble = null;
        this.currentSpeech = null;
    }, this);

}

/**
 * Checks if an object is part of a group.  Todo: there must be a simpler way...
 * 
 * @param  {object}  object The object to check
 * @param  {Group}  group  The group to check the object against
 * @return {Boolean}        Is the object part of this group?
 */
Bot.prototype.isChild = function(object, group) {
    if (group instanceof Group) {
        for (i = 0; i < group.children.length; i++) {
            if (group.children[i] = object) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Initialize the memory network and associated options.
 *
 * Docs on dataset object: http://visjs.org/docs/data/dataset.html
 */
Bot.prototype.setNetwork = function() {
    if (!memoryOn) {
        return;
    }
    this.nodes = new vis.DataSet(); // Main memory store
    this.edges = new vis.DataSet();
    this.options = {
        // configurePhysics:true,  // Uncomment to fine-tune graph
        nodes: {
            shape: 'dot',
            smooth: false, // For better performance. Todo: does not seem to work...
            // scaling: {
            //     customScalingFunction: function(min, max, total, value) {
            //         return value / total;
            //     },
            //     min: 1,
            //     max: 5
            // }
        }
    };
};


/**
 * Get a memory.  "Recall" it.  Returns null if there is no such memory.
 *
 * @param  {String} memoryToGet what to look for
 * @return a reference to the vis.js node
 */
Bot.prototype.getMemory = function(memoryToGet) {
    if (!memoryOn) {
        return null;
    }
    return this.nodes.get(memoryToGet);
}

/**
 * Check if a specified memory is contained in the memory network.
 */
Bot.prototype.containsMemory = function(memoryToCheck) {
    return (this.getMemory(memoryToCheck) != null);
}

/**
 * Add a memory to the network.  A memory is just  a string.
 * @param {Node} id the string id for the memory (rename id?)
 */
Bot.prototype.addNode = function(id) {
    if (!memoryOn) {
        return;
    }
    node = this.nodes.get(id);
    // If the node is already in the network, change its color
    if (node) {
        this.nodes.update({
            id: id,
            value: node.value + .1,
        });
        this.currentMemory = node;
    } else {
        // Otherwise, add a new node
        this.nodes.update({
            id: '' + id,
            label: '' + id,
            color: 'blue',
            value: 1 // Start at one
        });
    }
}

/**
 * Add a memory transition to the network.  This adds an edge just using the
 * last memory and the current one with a --> between.
 *
 * @param {String} last last memory that happened
 * @param {String} current memory
 */
Bot.prototype.addEdge = function(last, current) {
    if (!memoryOn) {
        return;
    }
    id = last + "-->" + current;
    //No recurrent connections
    if (last === current) {
        return;
    }
    edge = this.edges.get(id);
    // Edge already exists.  Update that edge
    if (edge) {
        this.edges.update({
            id: id,
            value: edge.value + .1,
        });
        this.currentTransition = edge;
    } else {
        // Add new edge
        this.edges.update({
            id: '' + id,
            label: '',
            from: '' + last,
            to: '' + current,
            value: 1, // Start at one
            color: 'blue'
        });
    }
    // parse
}

/**
 * Add a new memory to the network
 *
 * @param {String} memory the new memory
 */
Bot.prototype.addMemory = function(memory) {
    if (!memoryOn) {
        return;
    }
    this.addNode(memory);
    if (this.lastMemory) {
        this.addEdge(this.lastMemory, memory)
    }
    if (this.lastMemory != memory) {
        this.lastMemory = memory;
    }
}

/**
 * Remove the indicated memory
 *
 * @param {String} memory id of memory to remove
 */
Bot.prototype.forget = function(memory_id) {
    if (!memoryOn) {
        return;
    }
    this.nodes.remove(memory_id);
}


/**
 * Update the memory network by decaying all node and edge activations
 */
Bot.prototype.updateNetwork = function() {
    if (!memoryOn) {
        return;
    }
    currentBot = this;
    // Decay nodes
    this.nodes.forEach(function(node) {
        // Decay node
        let tempval = round(Math.min(2, Math.max(1, node.value - .01)), 2);
        if (currentBot.showActivations) {
            currentBot.nodes.update({ id: node.id, label: '' + tempval, value: tempval });
        } else {
            currentBot.nodes.update({ id: node.id, value: tempval });
        }
        // Color non-current nodes blue
        if (currentBot.currentMemory) {
            if (node.id != currentBot.currentMemory.id) {
                currentBot.nodes.update({ id: node.id, color: 'blue' });
            } else {
                currentBot.nodes.update({ id: node.id, color: 'red' });
            }
        }
    });

    // Decay Edges
    this.edges.forEach(function(edge) {
        let tempval = round(Math.min(2, Math.max(1, edge.value - .01)), 2);
        // Decay edge
        if (currentBot.showActivations) {
            currentBot.edges.update({ id: edge.id, label: '' + tempval, value: tempval });
        } else {
            currentBot.edges.update({ id: edge.id, value: tempval });
        }
        // Color non-current edges blue
        if (currentBot.currentTransition) {
            // console.log(edge, currentTransition);
            if (edge.id != currentBot.currentTransition.id) {
                currentBot.edges.update({ id: edge.id, color: 'blue' });
            } else {
                // edges.update({ id: edge.id, color: 'red' });
            }
        }
    });

    // network.selectNodes([node.id]);
    // console.log(node);
}


/**
 * Play sound, but only if the entity is visible.
 * 
 * @param  {Sound} sound_object sound to play if visible
 */
Bot.prototype.play = function(sound_object) {
    if (this.currentSound != null || !this.sprite.inCamera) {
        return;
    }
    // console.log(this.name + "is playing a sound");
    this.currentSound = sound_object;
    sound_object.play();
    sound_object.onStop.addOnce(function() { this.currentSound = null; }, this);
}

/**
 * Play a sound, with options to only play it in the visible area of the screen.
 *
 * @param {Object} sound object created by game
 * @param {Boolean} whether sound object is allowed to be heard by selected bot, when privacy is true, the sound is not going to be heared
 * @param {Boolean} whether sound object should be paused and resume if necessary
 *
 * @author Yang Liu
 */
Bot.prototype.playSound = function(sound_object, privacy = false, is_continuous = false) {
    if (typeof privacy != "undefined" && privacy && bots[currentBotIndex] != this) {
        //stop or pause or do not start to play
        if (sound_object.isPlaying && typeof sound_object[this.name + " is playing"] != "undefined" && sound_object[this.name + " is playing"]) {
            if (typeof is_continuous != "undefined" && is_continuous) {
                sound_object.pause();
            } else {
                sound_object.stop();
            }
        }
    } else if (typeof sound_object[this.name + " is playing"] == "undefined" || !sound_object[this.name + " is playing"]) {
        //resume or play
        sound_object[this.name + " is playing"] = true;
        if (sound_object.paused) {
            sound_object.resume();
        } else {
            sound_object.play();
        }
    } else if (!sound_object.isPlaying) {
        //not private, not playing, then definitely not by me
        sound_object[this.name + " is playing"] = false;
    }
};
