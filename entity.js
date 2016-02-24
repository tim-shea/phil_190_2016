//
// Parent object for all non-bot entities.
//
// Name must be the same as the name set in botPlayground.pre-load
//
function Entity(x, y, name, game) {
    this.x = x;
    this.y = y;
	this.sprite = game.add.sprite(x, y, name);
};