var maria = new Bot(240, 220, 'maria', 'bots/maria/maria.png');

maria.stateText = "The princess is here!";

maria.getStatus = function() {
    return maria.stateText;
}

maria.init = function() {
    this.body = this.sprite.body;
    maria.body.rotation = 100;
    maria.body.speed = 100; 
}

maria.update = function() {
    if (Math.random() < .1) {
        maria.incrementAngle(10);
        maria.angle = maria.angle % 180;
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            maria.body.speed = 100;
            maria.stateText = "Normal";
        } else {
            maria.body.speed = 100;
            maria.stateText = "Back";
        }
    }
    maria.basicupdate();
};
