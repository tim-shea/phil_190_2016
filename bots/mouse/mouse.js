var mouse = new Bot(120, 120, 'mouse', 'bots/mouse/mouse.gif');
mouse.angle = 50;
mouse.speed = 100;

mouse.update = function() {
    if (Math.random() < .1) {
        mouse.angle += 5;
    }
    if (Math.random() < .02) {
    	if (Math.random() < .5) {
	        mouse.speed = 50;
    	} else {
     		mouse.speed = -50;
    	}
    }
};
