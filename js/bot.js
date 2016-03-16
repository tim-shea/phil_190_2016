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
 * Generic update method
 */
Bot.prototype.genericUpdate = function() {
    this.collisionCheck();
    game.world.wrap(this.sprite);
    this.speechBubble.x = this.sprite.x + 50;
    this.speechBubble.y = this.sprite.y - 40;
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
 * Update the velocity and angle of the bot to update it's velocity.
 *
 * TODO: Possibly change name to something more descriptive.
 * A basic default update style.
 */
Bot.prototype.basicUpdate = function() {
    game.physics.arcade.velocityFromRotation(
        this.sprite.rotation,
        this.sprite.body.speed,
        this.sprite.body.velocity);
};

/**
 * Helper function to determine if one sprite overlaps another.
 * 
 * @param  {sprite} object 1
 * @param  {sprite} object 2
 * @return {boolean} true if overlap, false otherwise
 */
Bot.objectsOverlap = function(item1, item2) {
    if (item1 != item2) {
        // if(item1.body.enable && item2.body.enable) {
            return Phaser.Rectangle.intersects(item1.getBounds(), item2.getBounds());            
        // }
    }
    return false;
}

/**
 * Pursue the indicated object.
 *
 * @param  {Object} the object to pursue
 * @param  {Number} duration of pursuit in milliseconds
 */
Bot.prototype.pursue = function(objectToPursue, duration) {
    this.sprite.rotation = game.physics.arcade.angleBetween(this.sprite, objectToPursue.sprite);
    var pursuitTween = game.add.tween(this.sprite);
    pursuitTween.to({ x: objectToPursue.sprite.x, y: objectToPursue.sprite.y }, duration, Phaser.Easing.Exponential.InOut);
    pursuitTween.onComplete.add(this.pursuitCompleted);
    pursuitTween.start();
}

/**
 * Called after a pursuit completes.  Override if any functionality is needed.
 */
Bot.prototype.pursuitCompleted = function() {}

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

/**
 * Say something to the specified bot.
 *
 * @param {Bot} botToTalkTo the bot to talk to
 * @param {String} whatToSay what was said
 */
Bot.prototype.speak = function(botToTalkTo, whatToSay) {
    // Activate the speech Bubble
    this.speechBubble.bitmapText.text = whatToSay;
    // TODO speech bubble has extra left padding often.
    // SpeechBubble.wrapBitmapText(this.speechBubble.bitmapText, 200);
    this.speechBubble.visible = true;
    game.time.events.add(Phaser.Timer.SECOND * 1, function() { 
        this.speechBubble.visible = false; 
        this.isInteracting = false;}, this);

    // Call the listeners "hear" function
    if (botToTalkTo instanceof Bot && this.isInteracting === false) {
        if (game.physics.arcade.distanceBetween(this.sprite, botToTalkTo.sprite) < 100) {
            this.isInteracting = true;
            botToTalkTo.hear(this, whatToSay);
        }
    }
}

/**
 * Override to react when hearing something
 *
 * @param  {Bot} botWhoSpokeToMe who talked to me
 * @return {String} whatTheySaid what they said!
 */
Bot.prototype.hear = function(botWhoSpokeToMe, whatTheySaid) {
    console.log(botWhoSpokeToMe.name + " said " + whatTheySaid);
}

/**
 * High five a specified bot
 *
 * @param {Bot} botToHighFive the bot to high five
 */
Bot.prototype.highFive = function(botToHighFive) {
    if (botToHighFive instanceof Bot) {
        if (game.physics.arcade.distanceBetween(this.sprite, botToHighFive.sprite) < 100) {
            botToHighFive.highFived(this);
        }
    }
}

/**
 * Override to react when high fived
 *
 * @param  {Bot} botWhoSpokeToMe who talked to me
 */
Bot.prototype.highFived = function(botWhoHighFivedMe) {
    console.log(botWhoHighFivedMe.name + " high fived " + this.name);
}

/**
 * Bite a specified bot
 *
 * @param {Bot} botToAttack The bot to bite
 * @param {Number} damage Strength of the bite
 */
Bot.prototype.bite = function(botToAttack, damage) {
    if (botToAttack instanceof Bot) {
        if (game.physics.arcade.distanceBetween(this.sprite, botToAttack.sprite) < 50) {
            botToAttack.gotAttacked(this, damage);
        }
    }
};

/**
 * Override to react when attacked
 *
 * @param {Bot} botWhoAttackedMe The bot that bit me
 * @param {Number} damage The amount of damage done
 */
Bot.prototype.gotBit = function(botWhoAttackedMe, damage) {
    console.log(botWhoAttackedMe.name + "attacked me!");
};

/**
 * Yang's action - reaction
 */
Bot.prototype.antler_caress = function(botTocaress, message) {
    console.log(botTocaress.name + message);
};

Bot.prototype.antler_caressed = function(botWhocaresedMe, message) {
    console.log(botWhocaresedMe.name + "If you stroke this antler, you will be blessed by the wisps that lives on them.");
};

/**
 * Crush a bot at close proximity
 * @param  {Bot} botToCrush the bot being crushed
 * @param  {number} damage     damage of crushing, should be higher than biting?
 * 
 */
Bot.prototype.crush = function(botToCrush, damage) {
    if (botToCrush instanceof Bot) {
        if(game.physics.arcade.distanceBetween(this.sprite, botToCrush.sprite) < 10) {
            botToCrush.gotCrushed(this, damage);
        }
    }
}

/**
 * Bow down to bot
 * @param {Bot} botToBow the bot that is being bowed down to
 */
Bot.prototype.bow = function(botToBow) {
	if (botToBow instanceof Bot) {
		if(game.physics.arcade.distanceBetween(this.sprite, botToBow.sprite) < 15) {
            botToBow.gotBow(this);
        }
	}
};
/**
 * Override to react when bowed down to
 * 
 * @param {Bot} botWhoBowed bot who bowed down to me
 * 
 */
Bot.prototype.bower = function(botWhoBowed) {
	console.log(botWhoBowed.name + "bowed down to " + this.name);
};


/**
 * Lick a specified bot
 *
 * @param {Bot} botToLick the bot to lick
 */
Bot.prototype.lick = function(botTolick) {
    if (botTolick instanceof Bot) {
        if (game.physics.arcade.distanceBetween(this.sprite, botTolick.sprite) < 100) {
            botTolick.gotLicked(this);
        }
    }
};

Bot.prototype.shield = function(pursuantBot) {
    if (game.physics.arcade.distanceBetween(this.sprite, pursuantBot.sprite) < 150) {
        console.log("Shields up!");
    }
}

/**
 * Override to react when licked
 *
 * @param  {Bot} botWhoLickedToMe who licked me
 */
Bot.prototype.gotLicked = function(botWhoLickedMe) {
    console.log(botWhoLickedMe.name + " licked " + this.name);
};

