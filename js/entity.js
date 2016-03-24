//
// Parent object for all non-bot entities.
//
// Name must be the same as the name set in botPlayground.pre-load
//
function Entity(x, y, name) {
    this.x = x;
    this.y = y;
    this.sprite = entityGroup.create(x, y, name);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.name = name; // Todo: replace with description separate from name
    this.isEdible = false;
};
