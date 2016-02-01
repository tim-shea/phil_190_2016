var jeff = new Bot(240, 220, 'jeff', 'bots/jeff/person.png');
jeff.angle = 100; // Initial Angle
jeff.speed = 100; // Initial Speed

jeff.angleText;
jeff.motionText;

jeff.getStatus = function() {
    return jeff.angleText + "\n" + jeff.motionText + "\n";
}

jeff.update = function() {
	jeff.angleText = "Angle:" + jeff.angle + "\n";
    if (Math.random() < .1) {
        jeff.angle = (jeff.angle-2) % 180;
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            jeff.speed = 500;
	        jeff.motionText = "Motion: Spastic!";
        } else {
            jeff.speed = -100;
	        jeff.motionText = "Motion: backwards....";
        }
    }
};

