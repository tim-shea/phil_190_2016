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

    // Parent sprite.  Generally speaking, the body (see below) should be
    //   modified, not this.   But sometimes the reference is useful.
    //   See http://phaser.io/docs/2.4.4/index
    this.sprite;

    // Reference to the body of the sprite.  Play with this!
    // See http://phaser.io/docs/2.4.4/Phaser.Physics.Arcade.Body.html 
    this.body;

    // Eating each other is not yet supported.
    this.isEdible = false;

    // Flag turned on during bot interactions to prevent infinite loops between bots.
    this.isInteracting = false;

    // Override motion when in pursuit, etc.
    this.motionOverride = false;
    this.pursuit = null;
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
    this.speechBubble.x = this.sprite.x + 50;
    this.speechBubble.y = this.sprite.y - 40;
    game.physics.arcade.collide(this.sprite, entityGroup);
    if((this.pursuit != null) && (!this.motionOverride))  {
        this.pursue(this.pursuit, 1000);        
    }
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
 * Pursue the indicated object, for the indicated duration (in milliseconds), using a custom easing if desired
 *
 * Rough guideline on durations: 1000 = 1 second is fast, 100 is 1/10 second is super fast, 5000 = 5 seconds is slow
 * 
 * Easings listed here: http://phaser.io/docs/2.4.4/Phaser.Easing.html
 */
Bot.prototype.pursue = function(objectToPursue, duration, easing = Phaser.Easing.Exponential.InOut) {
    this.motionOverride = true;
    this.sprite.rotation = game.physics.arcade.angleBetween(this.sprite, objectToPursue.sprite);
    var pursuitTween = game.add.tween(this.sprite);
    pursuitTween.to({ x: objectToPursue.sprite.x, y: objectToPursue.sprite.y }, duration, easing);
    pursuitTween.onComplete.add(this.pursuitCompleted);
    pursuitTween.onComplete.add(function() { this.motionOverride = false; });
    pursuitTween.start();
}


/**
 * Called after a pursuit completes.  Override if any functionality is needed.
 */
Bot.prototype.pursuitCompleted = function() {}

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
 * Pursue the specified object for the specified amount of time.
 */
Bot.prototype.pursueForTime = function(objectToPursue, time=4) {
    if (!(this.pursuit === null)) {
        return;
    }
    this.pursuit = objectToPursue;
    console.log("Chasing " + objectToPursue.name);
    timer = game.time.events.add(Phaser.Timer.SECOND * time,
        function() {
            console.log("Done");
            this.pursuit = null;
        },
        this);
}

/**
 * Go to the indicated location on screen, at the indicated speed
 * (Duration in milliseconds it will take to get there.)
 *
 * Easings listed here: http://phaser.io/docs/2.4.4/Phaser.Easing.html
 */
Bot.prototype.goto = function(x, y, duration, easing = Phaser.Easing.Exponential.InOut) {
    this.motionOverride = true;
    var pursuitTween = game.add.tween(this.sprite);
    pursuitTween.to({ x: x, y: y }, duration, easing);
    pursuitTween.onComplete.add(function() { this.motionOverride = false; });
    pursuitTween.start();
}

/**
 * Go to some food item and take the indicated time to do it.
 * Small values = fast; larger values = slow.
 * TODO: Go to _nearest_ food
 */
Bot.prototype.findFood = function(duration, easing = Phaser.Easing.Exponential.InOut) {
    let food = foods[game.rnd.integerInRange(0,foods.length)];
    this.pursue(food, duration, easing);
}


/**
 * Turn away from the specified object and move with specified speed.
 *
 * TODO: Not a very effective flight algorithm yet.  Improve.
 * 
 * @param  {Bot} object object to run front
 * @param  {Number} speed speed to run with
 */
Bot.prototype.flee = function(object, speed) {
    this.sprite.rotation = game.physics.arcade.angleBetween(this.sprite, object.sprite) * -1;
    this.sprite.speed = speed;
}

/**
 * Returns a random object (bot or static entity)
 *
 * @return {Bot} the random entity
 */
Bot.prototype.getRandomObject = function() {
    let allObjects = entities.concat(bots);
    let chosenEntity = allObjects[game.rnd.integerInRange(0, allObjects.length - 1)]
    return chosenEntity;
}

/**
 * Pursue a random bot or entity.
 * 
 * Todo: prevent movement to self
 * 
 * @param {Number} speed in pixels/sec
 */
Bot.prototype.pursueRandomObject = function(speed) {
    let chosenEntity = this.getRandomObject();
    this.pursue(chosenEntity, speed);
    return chosenEntity;
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
