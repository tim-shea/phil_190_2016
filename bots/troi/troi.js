var troi = new Bot(251, 249, 'troi', 'bots/troi/umbreon.gif');
troi.angle = 50;
troi.speed = 100;

troi.update = function() {
    if (Math.random() < .1) {
        troi.angle += .5;
    }else{
    	troi.angle -= 2;
    }
    if (Math.random() < 0.1) {
    	if (Math.random() < 0.05) {
    		troi.speed = 10;
    	}else {
    		troi.speed = 100;
    	}
    };
};
