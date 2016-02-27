//
// Parent object for all bots.
//
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

};

//
// Returns a status string that describes the bot's internal state
//
Bot.prototype.getStatus = function() {
    return "Status function not yet defined for bot: " + this.name;
};

//
// Override to initialize the bot
//
Bot.prototype.init = function() {};

//
// Called every time the game is updated.  
//
Bot.prototype.update = function() {};

//
// Returns true if the bot is at the boundary of the world, false otherwise
//
Bot.prototype.atBoundary = function(amount) {
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

//
// Returns a random number between floor and ceiling 
// (Author: Daniel)
// 
Bot.prototype.getRandom = function(floor, ceiling) {
    var midpoint = (ceiling+floor)/2;
    var difference = ceiling-floor;
    var randomBetween = difference * Math.random() - (difference/2) + midpoint;
    return randomBetween;
}
//
// Calculates midpoint and difference between the given amounts to calculate a random number between the amounts
// Example of how to use:  "Daniel.incrementAngle(Daniel.getRandom(-5, 5));"
//
Bot.prototype.incrementAngle = function(amount) {
	this.sprite.body.rotation += amount;
    this.sprite.body.rotation = this.sprite.body.rotation % 180;
}

//
// Update the velocity and angle of the bot to update it's velocity.
// 
// A basic default update style.
//
Bot.prototype.basicUpdate = function() {
    game.physics.arcade.velocityFromRotation(
        this.sprite.rotation,
        this.sprite.body.speed,
        this.sprite.body.velocity);
};
