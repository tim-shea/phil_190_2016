var jeff = new Bot(240, 220, 'jeff', 'bots/jeff/person.png');
jeff.angle = 100; // Initial Angle
jeff.speed = 100; // Initial Speed

jeff.stateText = "Whatever";

jeff.getStatus = function() {
	return jeff.stateText;
}

jeff.update = function() {
    if (Math.random() < .1) {
        jeff.angle += 10;
        jeff.angle = jeff.angle % 180;
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            jeff.speed = 500;
	        jeff.stateText = "Spastic!";
        } else {
            jeff.speed = -100;
	        jeff.stateText = "Backwards....";
        }
    }
};

