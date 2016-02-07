var maria = new Bot(240, 220, 'maria', 'bots/maria/maria.png');
maria.angle = 100; // Initial Angle
maria.speed = 100; // Initial Speed

maria.stateText = "The princess is here!";

maria.getStatus = function() {
    return maria.stateText;
}

maria.update = function() {
    if (Math.random() < .1) {
        maria.angle += 10;
        maria.angle = maria.angle % 180;
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            maria.speed = 100;
            maria.stateText = "Normal";
        } else {
            maria.speed = 100;
            maria.stateText = "Back";
        }
    }
};
