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

Bot.prototype.getStatus = function() {
    return "Status function not yet defined for bot: " + this.name;
};

Bot.prototype.getBasicStats = function() {};

Bot.prototype.init = function(game) {};

Bot.prototype.update = function() {};

//
// Helper function to update angle
//
// Todo: not totally clear why angle can't be used here. I have to use rotation.
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
