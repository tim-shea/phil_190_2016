/**
 * Dummy bot.  Feel free to adjust / add functionality as needed.
 */
var dummy = new Bot(1750, 1750, 'dummy', 'js/bots/testDummy/dummy.png');


dummy.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.speed = 0; // Initial Speed

}

dummy.update = function() {
    // dummy.currentMotion.apply(dummy);
    dummy.genericUpdate();
};

dummy.collision = function(object) {
}
