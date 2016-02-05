var faust = new Bot(240, 220, 'faust', 'bots/faust/faust.gif');
faust.angle = 100; // Initial Angle
faust.speed = 100; // Initial Speed

faust.stateText = "mighty";

faust.getStatus = function() {
	return faust.stateText;
}

faust.update = function() {
    if (Math.random() < .1) {
        faust.angle += 10;
        faust.angle = faust.angle % 180;
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            faust.speed = 500;
	        faust.stateText = "Spastic!";
        } else {
            faust.speed = -100;
	        faust.stateText = "Backwards....";
        }
    }
};
