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
};

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
    if(this.speechBubble) {
        this.speechBubble.x = this.sprite.x + 50;
        this.speechBubble.y = this.sprite.y - 40;        
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
Bot.prototype.orientTowards = function(objectToFace, minInterEvent = Phaser.Timer.SECOND * .5, multiplier = 1) {
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
    this.currentTween.onComplete.add(function() { this.motionOverride = false;
        this.currentTween = null }, this);
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
        return Phaser.Rectangle.intersects(item1.getBounds(), item2.getBounds());
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
            return (a.temp_distance < b.temp_distance); });
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
        return object instanceof Bot; });
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
Bot.prototype.findFood = function(radius = 500, edibilityFunction = function(object) {
    return object.isEdible; }) {
    var nearbyFoods = this.getNearbyObjects(radius).filter(function(object) {
        return edibilityFunction(object); });
    if (nearbyFoods.length > 0) {
        this.pursue(nearbyFoods[0]);
    }
}

/**
 * Attack bots in the indicated radius
 */
Bot.prototype.attackNearbyBots = function(radius = 500, edibilityFunction = function(object) {
    return object.isEdible; }) {
    var nearbyBots = this.getNearbyBots(radius);
    if (nearbyBots.length > 0) {
        this.attackMotion(nearbyBots[0]);
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
Bot.prototype.makeSpeechBubble = function(text, howLong = 1000) {
    if (this.currentSpeech != null) {
        return;
    }
    // Activate the speech Bubble
    this.currentSpeech = text;
    this.speechBubble = game.world.add(new SpeechBubble(game, this.x+50, this.y - 40, 256,
            text));
    game.time.events.add(howLong, function() {
        this.speechBubble.visible = false;
        this.speechBubble = null;
        this.currentSpeech = null;
    }, this);

}
