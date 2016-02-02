function Bot(x, y, name, path) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.imagePath = path;

    this.angle = 0;
    this.speed = 100;

};

Bot.prototype.getStatus = function() {
	return "Status function not yet defined for bot: " + this.name;
};

// TODO: Return a string with angle and speed stats.
Bot.prototype.getBasicStats = function() {
};

Bot.prototype.init = function(game) {
    // Do something at a specified interval (Not working)
    //game.time.events.loop(Phaser.Timer.SECOND * .5, this.turn, this);
};

Bot.prototype.update = function() {
};


