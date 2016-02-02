var troi = new Bot(120, 120, 'troi', 'bots/troi/umbreon.gif');
troi.angle = 50;
troi.speed = 100;

troi.update = function() {
    if (Math.random() < .1) {
        troi.angle += 5;
    }
    if (Math.random() < 0.1) {
    	if (Math.random() < 0.05) {
    		troi.angle -= 10;
    	}else {
    		troi.angle += .5;
    	}
    };
};
