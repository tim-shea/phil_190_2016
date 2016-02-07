var Maria = new Bot(240, 220, 'Maria', 'bots/Maria/Maria.png');
Maria.angle = 100; // Initial Angle
Maria.speed = 100; // Initial Speed

Maria.stateText = "The princess is here!";

Maria.getStatus = function() {
	return Maria.stateText;
}

Maria.update = function() {
    if (Math.random() < .1) {
        Maria.angle += 10;
        Maria.angle = Maria.angle % 180;
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            Maria.speed = 100;
	        Maria.stateText = "Normal";
        } else {
            Maria.speed = 100;
	        Maria.stateText = "Back";
        }
    }
};